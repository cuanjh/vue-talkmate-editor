<template>
  <el-container class="login-regist-box">
    <div class="login_wrapper">
      <div class="login_form">
        <section class="login_content">
          <div class="login-left">
            <div class="icon-logo"><i></i></div>
            <span class="desc-talkmate"></span>
            <span class="desc text">欢迎使用全球说编辑器系统</span>
          </div>
          <el-main class="login-box" v-if="isLogin">
            <div class="talkmate-log"></div>
            <form>
              <div class="form-group text-group" id="text-icon" :class="{'active': addNameCls == true}">
                <i class="font_family icon-accout" ></i>
                <input type="text" id="username"
                      :placeholder="'请输入用户名'"
                      @focus="onFocusName()"
                      @blur.prevent="blurTextFn()"
                      v-model="loginForm.username">
              </div>
              <div class="form-group password-group" id="pwd-icon" :class="{'active': addPwdCls == true}">
                <i class="font_family icon-password"></i>
                <input type="password" id="password"
                      :placeholder="'请输入密码'"
                      @focus="onFocusPwd()"
                      @blur.prevent="blurTextFn()"
                      v-model="loginForm.password"
                      @keyup.enter="login()">
              </div>
              <div class="forget">
                <a href="javascript:;" @click="linkToForget()"><span>忘记密码了？</span></a>
              </div>
              <div class="btn_login">
                <button type="button" class="login-btn-panel" @click="login()">登 录</button>
                <i class="box-shadow"></i>
              </div>
            </form>
            <a class="go-register" href="javascript:;" @click="goRegister()"><span>去注册</span></a>
          </el-main>
          <register v-else @haveGoLogin="haveGoLogin"/>
        </section>
      </div>
      <!-- <forget @goBack="goBack"/> -->
    </div>
  </el-container>
</template>

<script>
import { mapActions } from 'vuex'
import Register from './register'
// import Forget from './forget'

export default {
  name: 'Login',
  data () {
    return {
      isLogin: true,
      isSavePwd: false, // 记住密码
      addNameCls: false,
      addPwdCls: false,
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  components: {
    Register
  },
  methods: {
    ...mapActions('user', ['LoginIn']),
    async login () {
      await this.LoginIn(this.loginForm)
    },
    // 去注册
    goRegister () {
      this.isLogin = false
    },
    // 登录
    haveGoLogin () {
      this.isLogin = true
    },
    // 忘记密码
    linkToForget () {
      this.$router.push({ name: 'resetPwd' })
    },
    goBack () {
      this.isShowForget = false
    },
    onFocusName () {
      this.addNameCls = true
    },
    onFocusPwd () {
      this.addPwdCls = true
    },
    blurTextFn () {
      if (this.loginForm.username !== '') {
        this.addNameCls = true
      } else {
        this.addNameCls = false
      }
      if (this.loginForm.password !== '') {
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

.login-regist-box {
  background: #F7F7F7;
  width:100%;
  height: 100%;
  position: absolute;
  background: url('../../assets/images/login/pic-login-bg.jpg') no-repeat center;
  background-size: cover;
  .login_wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .login_form {
    width: 100%;
    height: 100%;
  }
  .login_content {
    display: flex;
    margin: 0 auto;
    position: relative;
    text-align: center;
    min-width: 280px;
    width:842px;
    height:490px;
    background: #ffffff;
    border-radius:14px 12px 12px 14px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    box-shadow:0px 81px 44px -48px rgba(0,0,0,0.69);
  }
  .login-left {
    width: 370px;
    height: 100%;
    background: url('../../assets/images/login/pic-blue.png') no-repeat center;
    background-size: cover;
    border-radius: 12px 0 0 12px;
    padding-left: 42px;
    padding-top: 100px;
    box-sizing: border-box;
    .icon-logo {
      text-align: left;
      padding-bottom: 26px;
      i {
        display: inline-block;
        width: 56px;
        height: 76px;
        background: url('../../assets/images/login/icon-logo.svg') no-repeat center;
        background-size: cover;
      }
    }
    p {
      padding:0;
      margin: 0;
    }
    .desc-talkmate {
      display: block;
      width:134px;
      height:35px;
      background: url('../../assets/images/login/icon-talkmate.png') no-repeat center;
      background-size: cover;
      text-align: left;
    }
    .desc.text {
      display: block;
      font-size:18px;
      font-weight:500;
      color:rgba(255,255,255,1);
      line-height:25px;
      padding-top: 8px;
      text-align: left;
    }
  }
}
.login-box {
  position: relative;
  padding: 48px 74px 0;
  form {
    margin-bottom: 20px;
  }
  .talkmate-log {
    width:217px;
    height:41px;
    background: url('../../assets/images/login/icon-talkmate-logo.png') no-repeat center;
    background-size: cover;
    margin: 0 auto 50px;
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
  margin-top: 85px;
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
.go-register {
  font-size:16px;
  font-weight:400;
  color:rgba(0,0,0,1);
  line-height:22px;
}

</style>
