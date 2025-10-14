import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AccountClient } from './AccountClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account | Only Thing',
  description: 'Manage your account, orders, and preferences.',
};

export default function AccountPage() {
  return (
    <>
      <Header />
      <div style={{ paddingTop: '73px', minHeight: '100vh' }}>
        <AccountClient />
      </div>
      <Footer />
    </>
  );
}
