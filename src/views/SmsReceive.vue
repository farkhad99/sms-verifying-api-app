<template>
  <div id="app">
    <br>
    <h2>Receive SMS</h2>
       <div class="mobileoperations">
          <br>
          <h4 >Active operations:</h4>
          <hr>
          <br>
           <d-alert
                     :show="timeUntilDismissed"
                     theme="danger"
                     @alert-dismissed="timeUntilDismissed = 0"
                     @alert-dismiss-countdown="handleTimeChange">
                <b>An error occured, please try again later</b>
            </d-alert>
            <transition-group name="fade" >
              <div v-for="(operation, index) in operations"  :key="index">
                  <countdown  :name="operation.service"
                              :sms="operation.sms"
                              :date="operation.time"
                              :sum="(operation.sum*cur).toFixed(2)"
                              :number="operation.number"
                              :status="operation.response"
                              :tzid="operation.tzid"
                              :index="index" />
                <br>
              </div>
            </transition-group>
            <br>
          <h6 v-if=" noOperations">No active operations</h6>
        </div>
    <div class="country-section">
    <br>
      <d-form-select v-model="selectedCountry" :options="countries" />
      <d-list-group>
        <br>
        <div>
          <d-list-group-item v-for="(service, index) in services" class="serviceItem" :key="index">
            <img :src="'https://onlinesim.ru'+service.image" style="width: 16px; height: 16px;"> {{service.service}} 
            <div style="position: absolute;right: 70px;top: 15px;">
              <small>{{(service.price*cur).toFixed(2) }} $</small>
            </div>
            <d-button  class="buy-btn" outline pill theme="info" size="sm" @click="getNum(index)">Buy</d-button>
          </d-list-group-item>
        </div>
      </d-list-group>
    </div>
       <div class="operation-section">
          <br>
          <h4>Active operations:</h4>
          <hr>
          <br>
           <d-alert
                     :show="timeUntilDismissed"
                     theme="danger"
                     @alert-dismissed="timeUntilDismissed = 0"
                     @alert-dismiss-countdown="handleTimeChange">
                <b>An error occured, please try again later</b>
            </d-alert>
            <transition-group  name="fade">
              <div v-for="(operation, index) in operations"  :key="index">
                   <countdown :name="operation.service"
                              :sms="operation.sms"
                              :date="operation.time"
                              :sum="(operation.sum*cur).toFixed(2)"
                              :number="operation.number"
                              :status = "operation.response"
                              :tzid="operation.tzid"
                              :index="index"/>
                <br>
              </div>
            </transition-group>
            <br>
          <h6 v-if="noOperations">No active operations</h6>
        </div>
  </div>
</template>
<script>
     var axios = require('axios');
  export default{
data() {
        return {
            selectedCountry: null,
            countries: [
                { value: null, text: 'Please select a country' },
                { value: 7, text: 'Russia'          },
                { value: 86, text: 'China'          },
                { value: 44, text: 'United Kingdom' },
                { value: 31, text: 'Netherlands'    },
                { value: 380, text: 'Ukraine'       },
                { value: 77, text: 'Kazakhstan'     },
                { value: 48, text: 'Poland'         },
                { value: 996, text: 'Kyrgyzstan'    },
                { value: 234, text: 'Nigeria'       },
                { value: 381, text: 'Serbia'        },
                { value: 375, text: 'Belorussia'    },
                { value: 509, text: 'Haiti'         },
                { value: 220, text: 'Gambia'        },
                { value: 998, text: 'Uzbekistan'    },
                { value:  20, text: 'Egypt'         },
                { value: 225, text: 'Ivory Coast'   },
                { value: 967, text: 'Yemen'         },
                { value: 994, text: 'Azerbaijan'    },
                { value: 33, text: 'France'         },
                { value: 372, text: 'Estonia'       },
                { value: 235, text: 'Chad'          },
                { value: 237, text: 'Cameroon'      },
                { value: 964, text: 'Iraq'          },
            ],
            services: [],
            operations: [],
            noOperations: true,
            vloading: false,
            duration: 3,
            timeUntilDismissed: 0,
            update: null,
            cur: 0,
            numbers: [],
        }
    },
    methods: {
       getOperations: async (numbers) => { 
        const operations = numbers.map(async (number) => {
          console.log(number.tzid);
          const response = await axios({
              method: 'GET',
              url: "https://onlinesim.ru/api/getState.php?apikey=fa6693e134b45ef9063f4a46dfcaa3b4&tzid="+number.tzid
            })
            console.log(this)
          if(response.data[0]) return response.data[0]
        })
        var result = await Promise.all(operations);
        return result;
      },
        deleteNum(tzid){
            var uri = "http://localhost:3000/removeNum";
            this.axios.post(uri, {
              tzid: tzid, user_id: this.user.id
            }).then((res) =>{
                      console.log(res.data);
                      if(this.operations.length == 0) this.noOperations = true
                    })
                    .catch((err)=>{
                      console.log(err);
                    })
        },
      async getState(tzid){
        var stat = await this.axios.get("https://onlinesim.ru/api/getState.php?apikey=fa6693e134b45ef9063f4a46dfcaa3b4&tzid="+tzid)
        .then((res) => {
          if(res.data[0]){
            this.operations.unshift(res.data[0]);
            console.log(res.data[0]);
            this.noOperations = false;
            this.operations.sort(function(a, b){return b.time-a.time});
          } else {
            this.deleteNum(tzid)
          }
        })
        .catch((err) => {
          return "Error";
        });
      },
      handleTimeChange (time) {
      this.timeUntilDismissed = time
    },
    showAlert (){
      this.timeUntilDismissed = this.duration
    },
    getNumbers(){
      this.axios.get('http://localhost:3000/getnumbers/'+this.user.id).then((res) => {
          this.numbers = res.data.numbers;
          if(this.numbers.length != 0) { this.noOperations = false }
            this.operations = [];
          this.numbers.forEach(number => {
            this.getState(number.tzid);
          });
      })
      .catch(err => {
        alert(err);
      })
    },
      postNum(tzid, user_id){
          var uri = 'http://localhost:3000/postnumber';
          this.axios.post(uri, {
            tzid: tzid,
            user_id: user_id
          }).then((res) => {
            console.log("number posted");
          })
          .catch((err) => {
            alert("Error inserting number to server");
          })
      },
      orderNum(index){
          var slug = this.services[index].slug
          var uri = "https://onlinesim.ru/api/getNum.php?apikey=fa6693e134b45ef9063f4a46dfcaa3b4&service="+slug+"&country="+this.selectedCountry;
          this.axios.get(uri).then(res => {
            console.log(res.data);
            if(res.data.response != 1){
              alert("No free number, please, try later");
            } else{
              this.user    = JSON.parse(localStorage.getItem("user"));
              this.postNum(res.data.tzid, this.user.id);
              this.numbers.push({tzid: res.data.tzid});
              this.getState(res.data.tzid);
            }
          })

        },
        getBalance(index){
          this.axios.get("http://localhost:3000/getBalance/"+this.user.email)
          .then(res =>{
            console.log(res.data);
            console.log(res.data.balance)
            if(res.data.balance >= (this.services[index].price*this.cur).toFixed(2)){
               this.orderNum(index);
            } else {
              alert("Low balance")
            }
          })
          .catch("Error occured, please try again")
        },
      getNum(index){
      this.getBalance(index);
      window.scrollTo(0, 0)
      },
      getCurrency(){
        this.axios.get('https://api.exchangeratesapi.io/latest').then(res => {
          this.cur = (res.data.rates.USD/res.data.rates.RUB).toFixed(4);
        })
        .catch((err)=>{
          this.cur = 0.015;
        })
      }
  },
    mounted(){
      if(localStorage.getItem("user")){
          this.user    = JSON.parse(localStorage.getItem("user"));
      } 
        this.getNumbers();
        this.getCurrency();
        this.selectedCountry = JSON.parse(localStorage.getItem("selectedCountry"));
        console.log(this.numbers)
        this.update = window.setInterval(() => {
          this.operations = [];
          this.numbers.forEach(number => {
          this.getState(number.tzid);
          })
        }, 10000);
    },
     beforeDestroy(){
          clearInterval(this.update);
    },
    watch:{
      selectedCountry : function(val){
        localStorage.setItem("selectedCountry", val);
        var uri = "https://onlinesim.ru/api/getNumbersStats.php?apikey=fa6693e134b45ef9063f4a46dfcaa3b4&country="+val;
        this.axios.get(uri).then(res => {
          this.services = res.data.services;
        })
        .catch((err)=>{
          alert(err);
          alert("Error, please, tasdasdasry again");
        })
      }
    }
}
</script>
<style scoped>
.mobileoperations{
  display: none;
}
.buy-btn{
  float: right;
}
.serviceItem{
  text-align: left;
  cursor: pointer;
  padding-left: 5%;
  padding-right: 5px;
}
.serviceItem:hover{
  background-color: gray;
  color: white;
}
.country-section{
  display: inline-block;
  padding:30px;
  padding-top: 30px; 
  float: left;
  width:40%; 
}
.operation-section {
  display: inline-block;
  width: 60%;
  padding: 30px;
}
hr{
  margin: 0;
}
h4{
  display: inline-block;
}
@media (max-width: 760px){
  .operation-section {
    display: none;
  }
  .mobileoperations{
     display: inline-block;
  width: 100%;
  padding: 30px;
  }
  .country-section {
    width: 100%;
    margin: 0 auto;
  }
}
</style>
