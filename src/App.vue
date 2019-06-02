<template>
  <div id="app">
    <div id="nav">
      <d-navbar toggleable="md" type="dark" theme="primary">
        <d-navbar-toggle target="nav-collapse"></d-navbar-toggle>
        <d-navbar-brand>
            <router-link to="/"><h6 class="text-white my-auto mr-4">Logo</h6></router-link>
        </d-navbar-brand>
        <d-collapse is-nav id="nav-collapse">
          <d-navbar-nav>
            <router-link to="/sms-receive"> <d-nav-item>Receive SMS</d-nav-item>  </router-link>
            <router-link to="/about">       <d-nav-item>About</d-nav-item>        </router-link>
            <router-link to="/instructions"><d-nav-item>Instructions</d-nav-item> </router-link>
            <router-link to="/contacts">    <d-nav-item>Contacts</d-nav-item>     </router-link>
            <router-link to="/login" v-if="!loggedin" class="profile-section"><d-nav-item>Log in</d-nav-item></router-link>
            <div to="/" v-if="loggedin"  class="profile-section">
              <d-dropdown :text="email.substring(0, 10)+'...'"   class="profile-section">
                  <div style="padding-left: 20px;">balance: {{user.balance}}</div>
                  <d-dropdown-item><div @click="logout()">Log out</div></d-dropdown-item>
              </d-dropdown>
            </div>
          </d-navbar-nav>
        </d-collapse>
      </d-navbar>
    </div>
    <router-view @cartnumchange="onClickChild" />
  </div>
</template>
<script type="text/javascript">
 import { store } from "./store";
  export default{
    data(){
      return {
        loggedin: false,
        user: {
          email:'',
          balance: 0
        }
      }
    },
    computed:{
      email(){
        return store.username;
      }
    },
    methods:{
      onClickChild(quantity, user){
        this.user.email = this.user.email;
        this.loggedin = quantity;
        console.log(quantity);
      },
      logout(){
        localStorage.removeItem('user');
        localStorage.removeItem('jwt');
        this.loggedin = false;
        this.$router.push("/login")
      }
    },

    mounted(){
      if(localStorage.getItem("user")){
          this.user  = JSON.parse(localStorage.getItem("user"));
          console.log(this.user);
        this.loggedin = true;
      } 
    }
  }
</script>
<style>
.profile-section{
  float: right;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
html{
  scroll-behavior: smooth;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
