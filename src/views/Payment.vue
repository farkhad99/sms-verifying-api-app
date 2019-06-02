<template>
  <d-form style="padding: 40px;">
    <h2>Please, enter the amount and payment method</h2>
    <div id="paypal-button-container"></div>
</d-form>
</template>
<script>
paypal.Buttons({
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: '0.01'
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        alert('Transaction completed by ' + details.payer.name.given_name);
        // Call your server to save the transaction
        return fetch('localhost:5000/paypal-transaction-complete', {
          method: 'post',
          body: JSON.stringify({
            orderID: data.orderID
          })
        });
      });
    }
  }).render('#paypal-button-container');
export default {
  data () {
    return {
      form: {
        email: 'myemail@example.com',
        password: '',
        password2: '',
        tos: 'tos_agree'
      }
    }
  },
  methods: {

    handleOnSubmit (e) {
      e.preventDefault();
      alert(JSON.stringify(this.form));
    }
  }
}
</script>
