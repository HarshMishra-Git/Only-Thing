import type { StructureResolver } from 'sanity/desk';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Products')
        .child(
          S.list()
            .title('Products')
            .items([
              S.listItem()
                .title('All Products')
                .child(S.documentTypeList('product').title('All Products')),
              S.listItem()
                .title('Featured Products')
                .child(
                  S.documentList()
                    .title('Featured Products')
                    .filter('_type == "product" && featured == true')
                ),
              S.listItem()
                .title('Draft Products')
                .child(
                  S.documentList()
                    .title('Draft Products')
                    .filter('_type == "product" && status == "draft"')
                ),
              S.listItem()
                .title('Out of Stock')
                .child(
                  S.documentList()
                    .title('Out of Stock')
                    .filter('_type == "product" && status == "out_of_stock"')
                ),
            ])
        ),
      S.divider(),
      S.documentTypeListItem('category').title('Categories'),
      S.divider(),
      S.listItem()
        .title('Blog')
        .child(
          S.list()
            .title('Blog')
            .items([
              S.listItem()
                .title('All Posts')
                .child(S.documentTypeList('post').title('All Posts')),
              S.listItem()
                .title('Published Posts')
                .child(
                  S.documentList()
                    .title('Published Posts')
                    .filter('_type == "post" && status == "published"')
                ),
              S.listItem()
                .title('Draft Posts')
                .child(
                  S.documentList()
                    .title('Draft Posts')
                    .filter('_type == "post" && status == "draft"')
                ),
              S.listItem()
                .title('Featured Posts')
                .child(
                  S.documentList()
                    .title('Featured Posts')
                    .filter('_type == "post" && featured == true')
                ),
              S.divider(),
              S.documentTypeListItem('author').title('Authors'),
            ])
        ),
      S.divider(),
      S.documentTypeListItem('page').title('Pages'),
    ]);
