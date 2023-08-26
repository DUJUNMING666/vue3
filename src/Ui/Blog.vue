<template>
  <v-card>
    <v-layout>
      <v-toolbar dark class="full-width-toolbar">
        <v-app-bar-nav-icon ></v-app-bar-nav-icon>
        <v-toolbar-title>交流中心</v-toolbar-title>
        <v-btn @click="showArticle" icon >发布
          <v-icon>
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="showVisitorSquare" icon>游客广场 <v-icon>mdi-library</v-icon></v-btn>
        <v-spacer></v-spacer>
        <v-btn icon> 返回
          <v-icon>mdi-export</v-icon>
        </v-btn>
      </v-toolbar>
      <!-- 侧边栏内容 -->
      <!-- 侧边栏 -->
      <v-navigation-drawer expand-on-hover rail>
        <v-list>
          <v-list-item
              prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
              :title="user.Name"
              :subtitle="user.Email"
          ></v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list dense nav>
          <v-list-item prepend-icon="mdi-folder" title="个人信息" value="Info"></v-list-item>
          <v-list-item prepend-icon="mdi-account-multiple" title="历史发表" value="History"></v-list-item>
          <v-list-item prepend-icon="mdi-star" title="收藏" value="Start"></v-list-item>
        </v-list>
      </v-navigation-drawer>


    </v-layout>
    <!-- 主内容区域 -->
    <div class="main-content">
      <transition name="fade" mode="out-in">
        <Ground v-if="showVisitor" :key="'visitor-square'" class="fade-in-out"></Ground>
        <Subarticles v-else :key="'subarticles'" :user="user" class="fade-in-out"></Subarticles>
      </transition>
    </div>
  </v-card>

</template>

<script>
import Subarticles from "./Subarticles.vue";
import Ground from "./Ground.vue";

export default {
  inject: ['store'], // 注入 Vuex Store
  components: { Ground, Subarticles },
  data() {
    return {
      showVisitor: true,
      opacity: 0,
    };
  },
  computed: {
    user() {
      return this.store.state.user;
    }
  },
  methods: {
     showArticle() {
      this.showVisitor = false;
    },
    showVisitorSquare() {
      this.showVisitor = true;
    }
  }

};
</script>
<style>
.full-width-toolbar {
  width: 100%;
  height: 64px;
}
.main-content {
  width: 100%;
  height: calc(100vh - 64px);
  background-color: #d0c9c9;
  overflow: auto;
}
.fade-in-out {
  animation: fadeInOut 0.2s forwards;
  opacity: 1;
  transform: translatez(0);
}

@keyframes fadeInOut {
  0% {
    opacity: 0;transform: translatez(-20px);

  }
  50%{
    opacity: 0.5;
    transform: translatez(-10px);
  }
  100% {
    opacity: 1;
    transform: translatez(20px);
  }
}
</style>