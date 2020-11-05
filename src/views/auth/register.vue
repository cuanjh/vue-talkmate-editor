<template>
<el-main class="login-box">
  <h1>注册</h1>
  <form>
    <div class="form-group text-group" id="text-icon" :class="{'active': addNameCls == true}">
      <i class="font_family icon-accout" ></i>
      <input type="text" id="username"
            :placeholder="'请输入邮箱'"
            @focus="onFocusName()"
            @blur.prevent="blurTextFn()"
            v-model="registerForm.username">
    </div>
    <div class="form-group password-group" id="pwd-icon" :class="{'active': addPwdCls == true}">
      <i class="font_family icon-password"></i>
      <input type="password" id="password"
            :placeholder="'请输入密码'"
            @focus="onFocusPwd()"
            @blur.prevent="blurTextFn()"
            v-model="registerForm.password"
            @keyup.enter="register()">
    </div>
    <div class="btn_login">
      <button type="button" class="login-btn-panel" @click="register()">立即注册</button>
      <i class="box-shadow"></i>
    </div>
  </form>
  <a class="go-login" href="javascript:;" @click="goLogin()"><span>已有账号，去登录</span></a>
</el-main>

</template>

<script>
export default {
  data () {
    return {
      isSavePwd: false, // 记住密码
      addNameCls: false,
      addPwdCls: false,
      registerForm: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    goLogin () {
      this.$emit('haveGoLogin')
    },
    register () {
    },
    onFocusName () {
      this.addNameCls = true
    },
    onFocusPwd () {
      this.addPwdCls = true
    },
    blurTextFn () {
      if (this.registerForm.username !== '') {
        this.addNameCls = true
      } else {
        this.addNameCls = false
      }
      if (this.registerForm.password !== '') {
        this.addPwdCls = true
      } else {
        this.addPwdCls = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.font_family {
  font-size: 20px;
}
input {
  width: 323px;
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
.login-box {
  position: relative;
  padding: 48px 74px 0;
  h1 {
    font-size:24px;
    font-weight:600;
    color:rgba(0,0,0,1);
    line-height:33px;
    margin-bottom: 60px;
  }
  form {
    margin-bottom: 20px;
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
  .form-group.password-group {
    position: relative;
    margin-bottom: 14px;
  }
}
button {
  position: relative;
  margin-top: 98px;
  line-height: 50px;
  font-size: 16px;
  font-weight: 400;
  color: #fff;
  cursor: pointer;
  text-align: center;
  outline: none;
  width: 323px;
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
.forget {
  text-align: right;
  span {
    color: #CACACA;
    font-weight: 400;
    font-size: 13px;
  }
  span:hover {
    color: #5B5B5B;
  }
}
.go-login {
  font-size:16px;
  font-weight:400;
  color:rgba(0,0,0,1);
  line-height:22px;
}

</style>
