<template id="countdown-template">
  <transition name="fade">
  <span class="countdown">
     <d-card>
        <d-card-body class="operation-card">
          <div>
            <h5><span v-if="!showdata">{{number}}</span><span v-if="showdata">{{data}}</span></h5> {{name1}}
          </div>
          <div class="sum"><small>{{sum}} $</small></div>
           <hr>
           <br>
          <span v-if="!nosms"> Sms:  {{sms}}</span> 
          <div class="timer">
            <small class="digit">{{ minutes | two_digits }}</small>:<small class="digit">{{ seconds | two_digits }}</small></div>
          <br>
          <small>Status: {{statusCheck}}</small>
        </d-card-body>
      </d-card>
  </span>
</transition>
</template>
<style scoped>
.sum{
  display: inline-block;
  position: absolute; 
  right: 25px; top:20px
}
.operation-card{
  text-align: left;
  padding-bottom: 10px !important;
}
h5{
  display: inline-block;
  margin-left: 5px;
  margin-right: 25px;
}
  hr{
    margin: 0px;
  }
  .timer{
    float: right;
  }
  @media(max-width: 700){
    d-card-body{
      padding: 10px !important;
    }
  }
</style>
<script type="text/javascript">
  export default {
  props: {
    status: {
      date: String
    },
    index: {
      type: Number
    },
    date: {
      type: Number
    },
    name: {
      type: String
    },
    sms: {
      type: String
    },
    number: {
      type: String
    },
    sum:{
      type: String
    },
    tzid: {
      type: Number
    }
  },
  data() {
    return {
      showdata: false,
      timer: null,
      user: null,
      ended: false,
      nosms: true,
      now: Math.trunc((new Date()).getTime() / 1000),
      now2: Math.trunc((new Date()).getTime() / 1000),
    }
  },
 mounted(){
     window.setInterval(() => {
        this.now = Math.trunc((new Date()).getTime() / 1000);
    }, 1000);
  },
  computed: {
    statusCheck(){
      if(this.status == "TZ_NUM_ANSWER"){
        this.axios.get("http://localhost:3000/getnumber/"+this.tzid)
        .then(res => {
          if(res.data.used == 0){
            this.cutBalance();
          } else return "Service used"
        })
      } else if(this.status == "TZ_NUM_WAIT"){
        return "Waiting for sms"
      } else if(this.status == "TZ_INPOOL") {
        this.data = "No free number"
        this.showdata = true
        return "Waiting for number"
      }
    },
    cutBalance(){
      let sum = this.user.balance - this.sum
      this.axios.post('http://localhost:3000/balanceCut', {
        sum: sum,
        user_id: this.user.id,
        tzid: this.tzid
      }).then(res => {
        return "Service used"
      }) 
      .catch(err => {
        this.cutBalance();
      })
    },
    dateInMilliseconds() {
      return this.date + this.now2;
    },
    seconds() {
       if(this.sms != null){
        this.nosms = false;
      }
     
      return Math.trunc((this.dateInMilliseconds - this.now)) % 60;
    },
    minutes() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60) % 60;
    },
    name1(){
      if(this.name == "3223"){
          return "Facebook"
      } else {
        return this.name
      }
    }
  },
  filters: {
    two_digits:  function(value) {
          if (value < 0) {
            return '00';
          }
          if (value.toString().length <= 1) {
            return `0${value}`;
          }
          return value;
          }
    }
}
</script>
