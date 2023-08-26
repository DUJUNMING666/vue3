import Blog from "../Ui/Blog.vue";
import Login from "../Ui/Login.vue";
import Comment from "../Ui/CommentSection.vue";
import Subarticles from "../Ui/Subarticles.vue";
import subarticles from "../Ui/Subarticles.vue";

const routes = [
    {
        path: "/",
        redirect: "/login", // 重定向到登录页面
    },
    {
        path: "/login",
        component: Login,
    },
    {
        path: "/blog",
        component: Blog,
        name:"blog",
    },
    {
        path: "/subarticle",
        component: Subarticles,
        name:subarticles
    }

];

export default routes;
