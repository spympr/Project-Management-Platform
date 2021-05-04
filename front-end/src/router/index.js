import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/Home.vue";
import Prices from "../components/pricing/Prices.vue";
import HowItWorks from "../components/HowItWorks/howItWorks.vue";
import SignIn from "../components/Sign/SignIn.vue";
import SignUp from "../components/Sign/SignUp.vue";
import ForgotPassword from "../components/Sign/ForgotPassword.vue";
import ProfOpts from "../components/profile/prof_opts.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/how_it_works",
    name: "How_It_Works",
    component: HowItWorks,
  },
  {
    path: "/prices",
    name: "Prices",
    component: Prices,
  },
  {
    path: "/sign/in",
    name: "SignIn",
    component: SignIn,
  },
  {
    path: "/sign/up",
    name: "SignUp",
    component: SignUp,
  },
  {
    path: "/sign/forgot",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/Profile",
    name: "ProfOpts",
    component: ProfOpts,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;