<template>
<div class="register-page">
    <div class="register-left">
        <div class="logo">🎧</div>
        <h1>校园音乐平台</h1>
        <p>Discover Music · Share Your Voice</p>
    </div>

    <div class="register-right">
        <div class="register-box">
            <h2>注册</h2>
            <el-form :model="form">
                <el-form-item>
                    <el-input v-model="form.username" placeholder="用户名" />
                </el-form-item>
                <el-form-item>
                    <el-input v-model="form.password" type="password" placeholder="密码" show-password />
                </el-form-item>
                <el-button class="register-btn" @click="handleRegister">注册</el-button>
            </el-form>
            <div class="bottom">
                <span>已有账号？</span>
                <span class="login-text" @click="goLogin">立即登录</span>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { register } from "@/api/user";

const router = useRouter();

const form = reactive({
    username: "",
    password: "",
});


async function handleRegister() {
    if (!form.username || !form.password) {
        ElMessage.error("用户名和密码不能为空");
        return;
    }
    try {
        const res = await register(form);
        console.log(res);
        if (res.success) {
            ElMessage.success("注册成功，请登录");
            router.push("/sign-in");
        } else {
            ElMessage.error(res.message);
        }
    } catch (e) {
        ElMessage.error("服务器异常");
    }
}

function goLogin() {
    router.push("/sign-in");
}
</script>

<style scoped>
.register-page {
    height: 100vh;
    display: flex;
    background: #f5f5f5;
}

.register-left {
    width: 50%;
    background: #111;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.logo {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    border: 3px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 70px;
}

.register-left h1 {
    margin-top: 40px;
    font-size: 40px;
}

.register-left p {
    color: #aaa;
    font-size: 18px;
}

/* 右侧表单区域 */
.register-right {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.register-box {
    width: 360px;
    padding: 40px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, .1);
}

.register-box h2 {
    text-align: center;
    margin-bottom: 30px;
    color: #111;
}

.register-btn {
    width: 100%;
    height: 40px;
    background: #111;
    color: white;
    border: none;
}

.register-btn:hover {
    background: #333;
}

.bottom {
    margin-top: 20px;
    text-align: center;
    color: #999;
}

.login-text {
    color: #111;
    cursor: pointer;
    margin-left: 10px;
}
</style>