<template>
<div class="forget-form">
  <section class="forget_content">
    <el-main class="forget-box">
      <div class="forget-head">
        <i class="font_family icon-fanhui" @click="backLogin()"></i>
        <h1>找回密码</h1>
      </div>
      <form>
        <div class="form-group" :class="{'active': addEmailCls == true}">
          <i class="font_family icon-email1"></i>
          <input type="text" id="email"
                :placeholder="'请输入邮箱'"
                @focus="onFocusName()"
                @blur.prevent="blurTextFn()"
                v-model="forgetForm.email">
        </div>
        <div class="form-group" :class="{'active': addEmailSms == true}">
          <i class="font_family icon-CAPTCHA"></i>
          <input type="text" id="email"
                :placeholder="'请输入邮箱验证码'"
                @focus="onFocusSms()"
                @blur.prevent="blurTextFn()"
                v-model="forgetForm.email">
        </div>
        <div class="btn_login">
          <button type="button" class="login-btn-panel" @click="sendEmail()">发送验证邮件</button>
          <i class="box-shadow"></i>
        </div>
      </form>
      <a class="go-login" href="javascript:;" @click="backLogin()"><span>去登录</span></a>
    </el-main>
  </section>
</div>
</template>

<script>
export default {
  data () {
    return {
      addEmailCls: false,
      addEmailSms: false,
      forgetForm: {
        email: ''
      }
    }
  },
  methods: {
    onFocusName () {
      this.addEmailCls = true
    },
    onFocusSms () {
      this.addEmailSms = true
    },
    blurTextFn () {
      if (this.forgetForm.email !== '') {
        this.addEmailCls = true
      } else {
        this.addEmailCls = false
      }
    },
    backLogin () {
      this.$emit('goBack')
    },
    sendEmail () {}
  }
}
</script>

<style lang="scss" scoped>
.font_family {
  font-size: 20px;
}
.icon-CAPTCHA {
  font-size: 24px;
}
input {
  width: 100%;
  height: 38px;
  background-color: #fff!important;
  -webkit-appearance: textfield;
  -webkit-rtl-ordering: logical;
  padding: 0;
  border: none;
  outline: none!important;
  color: #050505;
  font-size: 14px;
  border-radius: 0;
  border-bottom: 1px solid #D2D2D2;
  padding-left: 40px;
  font-weight: 400;
  box-sizing: border-box;
  ::placeholder {
    font-size: 16px;
    font-weight: 500;
    color: #D2D2D2;
  }
}
button:focus{outline:0;}
input::-webkit-input-placeholder { /* WebKit browsers */
  color: #D2D2D2;
}
input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  color: #D2D2D2;
}
input::-moz-placeholder { /* Mozilla Firefox 19+ */
  color: #D2D2D2;
}
input:-ms-input-placeholder { /* Internet Explorer 10+ */
  color: #D2D2D2;
}

.forget-form {
  width: 100%;
  height: 100%;
}
.forget_content {
  margin: 0 auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  text-align: center;
  width: 470px;
  height: 490px;
  background: #ffffff;
  box-shadow:0px 81px 44px -48px rgba(0,0,0,0.69);
  border-radius:12px;
  padding: 38px 74px;
  box-sizing: border-box;
  .forget-head {
    display: flex;
    align-items: center;
    .icon-fanhui {
      cursor: pointer;
    }
    h1 {
      font-size:22px;
      font-weight:500;
      color:rgba(5,5,5,1);
      line-height:30px;
      margin: 0 auto;
    }
  }
  .forget-box {
    position: relative;
    padding: 0;
    form {
      margin-top: 84px;
      margin-bottom: 30px;
    }
    .btn_login {
      position: relative;
    }
    .form-group {
      position: relative;
      margin-bottom: 36px;
      outline:none;
      i {
        color: #D2D2D2;
        margin-right: 12px;
        position: absolute;
        left: 0;
        bottom: 10px;
      }
      &.active {
        input {
          border-color: #010101;
        }
        i {
          color: #010101;
        }
      }
    }
  }
  button {
    position: relative;
    margin-top: 65px;
    line-height: 50px;
    font-size: 16px;
    font-weight: 400;
    color: #fff;
    cursor: pointer;
    text-align: center;
    outline: none;
    width: 300px;
    height: 50px;
    background: #3e3e67;
    border-radius: 5px;
    -webkit-box-shadow: 0px 19px 24px -12px #3e3e67;
    box-shadow: 0px 19px 24px -12px #3e3e67;
    border: none;
  &:hover {
    background:rgba(62,62,103,.9);
    }
    &:active {
      background: #2A2A46!important;
      transform: scale(0.9);
      -webkit-transform: scale(0.9);
      -moz-transform: scale(0.9);
      -ms-transform: scale(0.9);
      outline:none;
      box-shadow: 0px 19px 24px -12px #3e3e67;
    }
  }
  .go-login {
    font-size:16px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:22px;
  }
}
</style>
