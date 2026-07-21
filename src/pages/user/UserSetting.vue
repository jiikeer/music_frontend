<template>
  <div class="setting-page">
    <div class="uid-text">UID: {{ userStore.userId || "0000000000000000" }}</div>

    <div class="form-row avatar-row">
      <label class="form-label">头像</label>
      <div class="avatar-wrap">
        <el-image class="avatar-img" :src="avatarUrl" fit="cover">
          <template #error>
            <svg viewBox="0 0 100 100" fill="#cccccc" width="100%" height="100%">
              <circle cx="50" cy="35" r="18"/>
              <path d="M50,60 A25,20 0 0,1 75,85 L25,85 A25,20 0 0,1 50,60"/>
            </svg>
          </template>
        </el-image>
        <el-button class="change-avatar-btn" @click="openAvatarUpload">更换</el-button>
        <input ref="avatarInput" type="file" accept="image/*" hidden @change="handleAvatarChange"/>
      </div>
    </div>

    <div class="form-row">
      <label class="form-label">昵称</label>
      <el-input v-model="form.username" placeholder="请输入昵称" class="form-input"/>
    </div>

    <!-- 性别单选 -->
    <div class="form-row">
      <label class="form-label">性别</label>
      <el-radio-group v-model="form.sex">
        <el-radio label="男"/>
        <el-radio label="女"/>
      </el-radio-group>
    </div>

    <div class="form-row">
      <label class="form-label">生日</label>
      <el-date-picker
        v-model="form.birth"
        type="date"
        placeholder="请选择生日"
        value-format="YYYY-MM-DD"
        class="form-input"
      />
    </div>

    <div class="form-row">
      <label class="form-label">电子邮箱</label>
      <el-input v-model="form.email" placeholder="请输入电子邮箱" class="form-input"/>
    </div>
    <div class="form-row">

  <label class="form-label">电话号码</label>
  <el-input
      v-model="form.phoneNum"
      placeholder="请输入电话号码"
      class="form-input"
  />
</div>
    <div class="form-row">
      <label class="form-label">个性签名</label>
      <el-input 
        v-model="form.introduction"
        type="textarea"
        maxlength="100"
        placeholder="请输入个性签名"
        class="form-textarea"
        show-word-limit
      />
    </div>

    <!-- 修改密码 -->
    <div class="form-row password-row">
    <label class="form-label">密码</label>
    <el-button class="password-btn" @click="showPasswordDialog=true">
        修改密码
    </el-button>
    </div>

    <div class="btn-group">
      <el-button class="save-btn" @click="saveUserInfo" :loading="loading">保存</el-button>
      <el-button class="cancel-btn" @click="goBack">取消</el-button>
    </div>

    <el-dialog
    v-model="showPasswordDialog"
    title="修改密码"
    width="400px"
    custom-class="pwd-dialog"
    >
    <el-form class="pwd-form">
        <el-form-item label="旧密码">
            <el-input
                v-model="passwordForm.oldPassword"
                type="password"
                show-password
                placeholder="请输入旧密码"
            />
        </el-form-item>
        <el-form-item label="新密码">
            <el-input
                v-model="passwordForm.password"
                type="password"
                show-password
                placeholder="请输入新密码"
            />
        </el-form-item>
        <el-form-item label="确认密码">
            <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                show-password
                placeholder="再次输入密码"
            />
        </el-form-item>
    </el-form>
    <template #footer>
    <div class="dialog-footer">
        <el-button @click="showPasswordDialog=false">取消
        </el-button>
        <el-button type="primary" @click="updatePassword">
        确认修改
        </el-button>
    </div>
    </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
import { attachImageUrl } from "@/utils";
import { ElMessage } from "element-plus";
import { updateUser, uploadAvatar, getUserDetail, updatePasswordApi} from "@/api/user";

const router = useRouter();
const userStore = useUserStore();
const avatarInput = ref(null);
const loading = ref(false);
const showPasswordDialog = ref(false);

const passwordForm = ref({
    oldPassword:"",
    password:"",
    confirmPassword:""
});
const form = ref({
  id: "",
  username: "",
  sex: null,
  birth: "",
  phoneNum:"",
  email: "",
  introduction: ""
});


const avatarUrl = computed(() => attachImageUrl(userStore.avatar));

onMounted(() => {
  form.value.id = userStore.userId;
  form.value.username = userStore.username || "";
  form.value.sex = userStore.sex || "";
  form.value.birth = userStore.birth || "";
  form.value.email = userStore.email || "";
  form.value.introduction = userStore.introduction || "";
  form.value.phoneNum =userStore.phoneNum || "";
});

function openAvatarUpload() {
  avatarInput.value.click();
}

async function handleAvatarChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (!form.value.id) {
    return ElMessage.warning(
      "登录状态异常，请重新登录"
    );
  }
  loading.value = true;
  try {
    // 1. 上传头像
    await uploadAvatar(
      form.value.id,
      file
    );
    // 2. 重新查询最新用户信息
    const userRes = await getUserDetail(
      form.value.id
    );
    // 3. 更新Pinia + localStorage
    userStore.login(
      userRes.data
    );
    ElMessage.success(
      "头像上传成功"
    );
  } catch(err) {
    console.log(err);
    ElMessage.error(
      "头像上传失败，请检查图片格式或网络"
    );
  } finally {
    loading.value = false;
    e.target.value = "";
  }
}

async function saveUserInfo() {
  if (!form.value.username.trim()) return ElMessage.warning("昵称不能为空");
  loading.value = true;
  try {
    console.log("提交给后端的数据：", form.value)
    await updateUser(form.value);
    userStore.updateUserInfo(form.value);
    ElMessage.success("个人信息保存成功");
    router.push("/user-personal");
  } catch (err) {
    console.error("更新接口错误：", err)
    ElMessage.error("保存失败，请检查填写内容");
  } finally {
    loading.value = false;
  }
}

async function updatePassword(){
    if(
        !passwordForm.value.oldPassword ||
        !passwordForm.value.password
    ){
        ElMessage.warning(
            "密码不能为空"
        );
        return;
    }
    if(
        passwordForm.value.password
        !==
        passwordForm.value.confirmPassword
    ){
        ElMessage.warning(
            "两次密码不一致"
        );
        return;
    }
    try {
        const data={
            id:userStore.userId,
            username:userStore.username,
            oldPassword:
            passwordForm.value.oldPassword,
            password:
            passwordForm.value.password
        };
        const res =
        await updatePasswordApi(data);
        if(res.success){
            ElMessage.success(
                "密码修改成功，请重新登录"
            );
            showPasswordDialog.value=false;
            userStore.logout();
            router.push("/sign-in");
        }else{
            ElMessage.error(
                res.message
            );
        }
    }catch(err){
        console.log(err);
        ElMessage.error(
            "密码修改失败"
        );
    }
}

function goBack() {
  router.push("/user-personal");
}
</script>

<style scoped>
.setting-page {
  background: #1a1a1a;
  color: #cccccc;
  padding: 30px 60px;
}

.uid-text {
  font-size: 22px;
  color: #999999;
  margin-bottom: 30px;
}

.form-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 30px;
  gap: 20px;
}
.form-label {
  width: 100px;
  font-size: 20px;
  padding-top: 10px;
  flex-shrink: 0;
}

.avatar-row {
  align-items: center;
}
.avatar-wrap {
  display: flex;
  align-items: center;
  gap: 20px;
}
.avatar-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #ffffff;
}

.form-input {
  width: 300px;
}
.form-textarea {
  width: 300px;
}

:deep(.el-input__wrapper) {
  background: #2c2c2c;
  box-shadow: 0 0 0 1px #666666 inset;
}
:deep(.el-input__inner) {
  color: #eeeeee;
}
:deep(.el-textarea__inner) {
  background: #2c2c2c;
  color: #eeeeee;
}
:deep(.el-input__count) {
  color: #999999;
}

/* 日期选择器深色适配 */
:deep(.el-date-editor .el-input__wrapper) {
  background: #2c2c2c;
  box-shadow: 0 0 0 1px #666 inset;
}
:deep(.el-date-editor .el-input__inner) {
  color: #eee;
}

/* 单选按钮文字深色适配 */
:deep(.el-radio__label) {
  color: #cccccc;
  font-size: 18px;
}
:deep(.el-radio__inner) {
  background: #2c2c2c;
  border-color: #aaaaaa;
}

.btn-group {
  margin-top: 60px;
  display: flex;
  gap: 60px;
  
}
.save-btn {
  width: 150px;
  height: 50px;
  font-size: 20px;
  font-weight: 600;
  background: #ffffff;
  border: none;
  color: #000000;
  border-radius: 999px;
}
.cancel-btn {
  width: 150px;
  height: 50px;
  font-size: 20px;
  background: #333333;
  border: none;
  color: #ffffff;
  border-radius: 999px;
}

/* 更换头像黑白按钮 */
.change-avatar-btn {
  width: 100px;
  height: 42px;
  font-size: 16px;
  color: #aaaaaa;
  background: transparent;
  border:none;
}
.change-avatar-btn:hover {
  background: transparent;
  color: #fff;
}
.password-btn{
    width:150px;
    height:45px;
    background:#333;
    color:#fff;
    border:none;
    border-radius:8px;
}
.password-btn:hover{
    background:#555;
}

:deep(.el-dialog) {
  background: #1a1a1a;
}
:deep(.el-dialog__header) {
  border-bottom: 1px solid #333;
}
:deep(.el-dialog__title) {
  color: #eee;
}
:deep(.el-dialog__close) {
  color: #999;
}
.pwd-form {
  padding: 10px 0;
}
.dialog-input {
  width: 100%;
}
:deep(.el-form-item__label) {
  color: #ccc;
  font-size: 16px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}
:deep(.dialog-footer .el-button) {
  background: #fff;
  color: #000;
  border: none;
}
:deep(.el-dialog .el-button:hover){
  background: #fff !important;
}
</style>