<template>
  <v-app>
  <v-container fluid="flex">
    <v-row justify="center" align="center" class="login-container">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="headline">Login</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field v-model="id" label="Username"></v-text-field>
              <v-text-field v-model="password" label="Password" type="password"></v-text-field>
              <v-btn color="primary" type="submit">Login</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <router-view></router-view>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  inject: ['store'],
  data() {
    return {
      id: '',
      password: '',
      message:'',
      user:[]
    };
  },
  methods: {
   async login() {
     try{
      const response = await axios.post('/api/login',{
        id:this.id,
        password:this.password
      });
      if (response.data.success){
        this.message ="login successful"
        console.log(this.message); // 添加此行
        const userInfoResponse = await axios.get('/api/data', {
          params: {
            id: this.id
          }
        });
        this.User = userInfoResponse.data;
        // 使用注入的 Vuex Store 来调用 commit 方法
        this.store.commit('updateUser', this.User);
        this.$router.push({ name: "blog"});
      }
      else {
        this.message = 'Login failed';
      }

    } catch (error) {
      console.error('Error during login:', error);
    }
    },
  },
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
}
</style>
