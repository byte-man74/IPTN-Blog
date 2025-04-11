export const CientRoutes = {
    home: "admin",
    categories: "",
    viewNews: "news",
    createNews: "news/create",
    posts: "posts",
    createPost: "posts/create",
    editPost: (id: string) => `posts/edit/${id}`,
    users: "users",
    settings: "settings"
}
