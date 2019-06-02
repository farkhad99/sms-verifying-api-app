<template>
  <div style="padding: 40px; max-width: 700px; margin: 0 auto;">
      <h2>Register</h2><br>
    <label class="sr-only" for="f1_Username">Username</label>
    <d-input id="f1_Username" v-model="form.email" class="mb-2 mr-sm-2 mb-sm-0" placeholder="Username" />
    <br>
    <label class="sr-only" for="f1_Password">Password</label>
    <d-input id="f2_Password"  v-model="form.password" class="mr-2" type="password" placeholder="Password" /><br>
     <label class="sr-only" for="f1_Password">Confirm password</label>
    <d-input id="f2_Passsword"  v-model="form.password2" class="mr-2" type="password" placeholder="Confirm Password" />
<br>
<br>
    <d-button theme="primary" @click="register()">Register</d-button>
    <br>
    <br>
    <router-link to="/login">Log in</router-link>
</div>
</template>
<script>
export default {
  data () {
    return {
      form: {
        email: 'myemail@example.com',
        password: '',
        password2: '',
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
        alert("You have entered an invalid email address!")
        return (false)
    },
    passwordValidate(){
      if(this.form.password.length < 8){
        return false
      } else if(this.form.password != this.form.password2){
        return false
      } else return true
    },
 register(e) {
  this.loading = true;
      if(this.form.password){
        if(this.validateEmail()){
          if (this.form.password === this.form.password2 && this.form.password.length > 6)
              {
                  let url = "http://localhost:3000/register"
                  this.axios.post(url, {
                      email: this.form.email,
                      password: this.form.password,
                  })
                  .then(response => {
                    console.log(response.data);
                      localStorage.setItem('user', JSON.stringify(response.data.user))
                      localStorage.setItem('jwt', response.data.token)
                      if (localStorage.getItem('jwt') != null){
                          this.$emit('loggedIn')
                          if(this.$route.params.nextUrl != null){
                              this.$router.push(this.$route.params.nextUrl)
                          }
                          else{
                             this.$emit('cartnumchange', true, response.data.user.email);
                              this.$router.push('/sms-receive')
                          }
                      }
                  })
                  .catch(error => {
                    alert(error)
                  });
              } else {
                  this.form.password = ""
                  this.form.password2 = ""
                  return alert("Passwords do not match")
              }
          }
      } else alert("Enter your email and password")
    
    }     
  }
}
</script>
