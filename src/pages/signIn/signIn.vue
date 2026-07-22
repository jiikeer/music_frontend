<template>
<div class="login-page">
    <!-- 左侧区域 -->
    <div class="login-left">
        <div class="logo">🎧</div>
        <h1>校园音乐平台</h1>
        <p>Discover Music · Share Your Voice</p>
    </div>

    <!-- 右侧登录 -->
    <div class="login-right">
        <div class="login-box">
            <h2>登录</h2>
            <el-form :model="form">
                <el-form-item>
                    <el-input v-model="form.username" placeholder="用户名" />
                </el-form-item>
                <el-form-item>
                    <el-input v-model="form.password" type="password" placeholder="密码" show-password />
                </el-form-item>
                <el-button class="login-btn" @click="handleLogin">登录</el-button>
            </el-form>
            <div class="bottom">
                <span>还没有账号？</span>
                <a @click="goRegister">立即注册</a>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
import {reactive} from "vue";
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import {useUserStore} from "@/store/user";
import { login as apiLogin } from "@/api/user";

const router = useRouter();
const userStore = useUserStore();

const form = reactive({
    username:"",
    password:""
});

async function handleLogin(){
    if(!form.username || !form.password){
        ElMessage.error("请输入账号密码");
        return;
    }

    try {
        const res = await apiLogin(form);
        console.log(res);
        if(res.success){
            const isAdmin = form.username === 'admin';
            userStore.login({ ...res.data, role: isAdmin ? 'admin' : 'user' });
            ElMessage.success(isAdmin ? "管理员登录成功" : "登录成功");
            router.push(isAdmin ? "/admin" : "/");
        }else{
            ElMessage.error(res.message || "账号或密码错误");
        }
    } catch (e) {
        ElMessage.error("登录失败，请检查网络");
    }
}

function goRegister(){
    router.push("/sign-up");
}
</script>

<style scoped>
.login-page{
    height:100vh;
    display:flex;
    background:#f5f5f5;
}

/* 左侧 */
.login-left{
    width:50%;
    background:#111;
    color:white;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
}

.logo{
    width:160px;
    height:160px;
    border-radius:50%;
    border:3px solid white;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:70px;
}

.login-left h1{
    margin-top:40px;
    font-size:40px;
}

.login-left p{
    color:#aaa;
    font-size:18px;
}

/* 右侧 */
.login-right{
    width:50%;
    display:flex;
    justify-content:center;
    align-items:center;
}

.login-box{
    width:360px;
    padding:40px;
    background:white;
    border-radius:10px;
    box-shadow:0 5px 20px rgba(0,0,0,.1);
}

.login-box h2{
    text-align:center;
    margin-bottom:30px;
    color:#111;
}

.login-btn{
    width:100%;
    height:40px;
    background:#111;
    color:white;
    border:none;
}

.login-btn:hover{
    background:#333;
}

.bottom{
    margin-top:20px;
    text-align:center;
    color:#999;
}

.bottom a{
    color:#111;
    cursor:pointer;
    margin-left:10px;
}
</style>