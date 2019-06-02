<template>
  <div style="padding: 40px; max-width: 700px; margin: 0 auto;">
      <h2>Log in</h2><br>
    <label class="sr-only" for="f1_Username">Username</label>
    <d-input id="f1_Username" v-model="form.email" class="mb-2 mr-sm-2 mb-sm-0" placeholder="Email" />
    <br>
    <label class="sr-only" for="f1_Password">Password</label>
    <d-input id="f2_Password" v-model="form.password" class="mr-2" type="password" placeholder="Password" />
<br>
<br>
    <d-button theme="primary" @click="login()">Login</d-button>
    <br>
    <br>
    <router-link to="/register">Register</router-link>
</div>
</template>
<script>
 import { mutations } from "../store";

export default {
  data () {
    return {
      form: {
        email: '',
        password: '',
        loading: true
      }
    }
  },
  methods: {
   validateEmail() 
    {
     if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.form.email))
      {
        return (true)
      }
        else {
              alert("You have entered an invalid email address!")
              return (false)
            }
    },
    passwordValidate(){
      if(this.form.password.length < 8){
        return false
      }  else return true
    },
    login(){
      if(this.form.password.length > 1 && this.form.email.length > 1){
          this.loading = true;
          var uri = "http://localhost:3000/login";
          this.axios.post(uri, {
            email: this.form.email,
            password: this.form.password
          }).then(res => {
                console.log(res.data.user);
                mutations.setUsername(res.data.user.email)
                localStorage.setItem('user', JSON.stringify(res.data.user))
                localStorage.setItem('jwt', res.data.token)
                    this.$router.push('/sms-receive')
                        })
          .catch(err => {
            console.log(err);
          })
      } else alert("Please enter email and password")
    }
  }
}
</script>
