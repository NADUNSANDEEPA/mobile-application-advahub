export const FavoritePageSchema = {
  name: "FavoritePage",
  primaryKey: "pageId",
  properties: {
    pageId: "string",
    pageTitle: "string",
    isFavorite: "bool",
    visitorId: "string",
    visitorEmail: "string",
  },
};