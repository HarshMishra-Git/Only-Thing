import { logger } from '../utils/logger';
import prisma from '../prisma/client';

interface MetricData {
  timestamp: Date;
  value: number;
  labels?: Record<string, string>;
}

class MonitoringService {
  private metrics: Map<string, MetricData[]> = new Map();
  private readonly maxMetricsPerKey = 1000;

  /**
   * Record a metric value
   */
  recordMetric(name: string, value: number, labels?: Record<string, string>) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metrics = this.metrics.get(name)!;
    metrics.push({
      timestamp: new Date(),
      value,
      labels,
    });

    // Keep only recent metrics
    if (metrics.length > this.maxMetricsPerKey) {
      metrics.shift();
    }
  }

  /**
   * Increment a counter
   */
  incrementCounter(name: string, labels?: Record<string, string>) {
    this.recordMetric(name, 1, labels);
  }

  /**
   * Record request timing
   */
  recordTiming(name: string, duration: number, labels?: Record<string, string>) {
    this.recordMetric(`${name}_duration`, duration, labels);
    logger.debug(`${name} took ${duration}ms`, labels);
  }

  /**
   * Get metric statistics
   */
  getMetricStats(name: string, minutes: number = 5) {
    const metrics = this.metrics.get(name) || [];
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    const recent = metrics.filter(m => m.timestamp >= cutoff);

    if (recent.length === 0) {
      return null;
    }

    const values = recent.map(m => m.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    // Calculate percentiles
    const sorted = [...values].sort((a, b) => a - b);
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];

    return {
      count: recent.length,
      sum,
      avg,
      min,
      max,
      p50,
      p95,
      p99,
    };
  }

  /**
   * Get all metrics summary
   */
  getAllMetrics() {
    const summary: Record<string, any> = {};
    
    for (const [name, _] of this.metrics) {
      summary[name] = this.getMetricStats(name);
    }

    return summary;
  }

  /**
   * Check system health
   */
  async checkSystemHealth() {
    const checks: any = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      checks: {},
    };

    // Database check
    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.checks.database = {
        status: 'healthy',
        message: 'Database connection OK',
      };
    } catch (error: any) {
      checks.status = 'unhealthy';
      checks.checks.database = {
        status: 'unhealthy',
        message: error.message,
      };
    }

    // Memory check
    const memUsage = process.memoryUsage();
    const memoryHealthy = memUsage.heapUsed < memUsage.heapTotal * 0.9;
    checks.checks.memory = {
      status: memoryHealthy ? 'healthy' : 'warning',
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
      percentage: `${Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)}%`,
    };

    // Uptime
    checks.checks.uptime = {
      status: 'healthy',
      seconds: Math.floor(process.uptime()),
      formatted: this.formatUptime(process.uptime()),
    };

    return checks;
  }

  /**
   * Get database statistics
   */
  async getDatabaseStats() {
    try {
      const [
        userCount,
        productCount,
        orderCount,
        dbSize,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.order.count(),
        // PostgreSQL specific - get database size
        prisma.$queryRaw`SELECT pg_database_size(current_database()) as size`,
      ]);

      return {
        tables: {
          users: userCount,
          products: productCount,
          orders: orderCount,
        },
        size: dbSize,
      };
    } catch (error) {
      logger.error('Error fetching database stats:', error);
      return null;
    }
  }

  /**
   * Record API endpoint hit
   */
  recordEndpointHit(method: string, path: string, statusCode: number, duration: number) {
    this.incrementCounter('api_requests_total', {
      method,
      path,
      status: statusCode.toString(),
    });

    this.recordTiming('api_request', duration, {
      method,
      path,
    });
  }

  /**
   * Record error
   */
  recordError(error: Error, context?: Record<string, any>) {
    this.incrementCounter('errors_total', {
      type: error.name,
      message: error.message.substring(0, 100),
    });

    logger.error('Error recorded:', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      context,
    });
  }

  /**
   * Format uptime
   */
  private formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${secs}s`);

    return parts.join(' ');
  }

  /**
   * Clear old metrics
   */
  clearOldMetrics(olderThanMinutes: number = 60) {
    const cutoff = new Date(Date.now() - olderThanMinutes * 60 * 1000);
    
    for (const [name, metrics] of this.metrics) {
      const filtered = metrics.filter(m => m.timestamp >= cutoff);
      this.metrics.set(name, filtered);
    }
  }
}

export const monitoringService = new MonitoringService();

// Clear old metrics every 10 minutes
setInterval(() => {
  monitoringService.clearOldMetrics(60);
}, 10 * 60 * 1000);

export default monitoringService;
