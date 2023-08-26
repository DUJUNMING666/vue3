<template>
  <div class="container">
    <v-card id="card">
      <v-text-field v-model="title" label="文章标题:" style="font-size: 20px"></v-text-field>
      <v-text-field v-model="currentTime" label="发布时间:" readonly></v-text-field>
      <div class="blog-editor">
        <QuillEditor ref="editor" v-model="content" :options="editorOptions"></QuillEditor>
        <v-btn @click="publishBlog" color="primary">发布文章</v-btn>
      </div>

      <!-- 添加对话框部分 -->
      <v-dialog v-model="dialogVisible" max-width="500">
        <v-card>
          <v-card-title>
            <span class="headline">{{ dialogTitle }}</span>
          </v-card-title>
          <v-card-text>{{ dialogMessage }}</v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="dialogVisible = false">确定</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>

</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import axios from 'axios';
import Theme from "quill/core/theme.js";

export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '',
      dialogMessage: '',
      title: '',
      content: "",
      currentTime: '',
      editorOptions: {
        placeholder: '在此处编写文章内容...',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{'header': 1}, {'header': 2}],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'script': 'sub'}, {'script': 'super'}],
            [{'indent': '-1'}, {'indent': '+1'}],
            [{'direction': 'rtl'}],
            [{'size': ['small', false, 'large', 'huge']}],
            [{'header': [1, 2, 3, 4, 5, 6, false]}],
            ['link', 'image'],
            ['clean'],
            [{'align': []}],
            [{'color': []}, {'background': []}],
            [{'font': []}],
          ]
        }
      },
    };
  },
  methods: {

    async publishBlog() {
      try {
        // 获取编辑器实例
        const quillInstance = this.$refs.editor.getQuill()
        // 获取纯文本内容
        //this.content = quillInstance.getText().trim();
        //this.content = quillInstance.getHTML()
        const htmldata = quillInstance.root.innerHTML
        this.content = htmldata
        // 设置适当的 Content-Type 和转换为 JSON 格式
        const headers = {
          'Content-Type': 'application/json'
        };

        const response = await axios.post('/api/create', {
          contents: this.content,
          articlename: this.title,
          subtime: this.currentTime.toString(),
          authorid: this.user.Id,
          authorname: this.user.Name,
        }, { headers });
        if (this.title !== '' && this.content !== '') {
          if (response.data.success) {
            this.dialogTitle = '成功';
            this.dialogMessage = '文章发布成功！';
            this.dialogVisible = true;
            console.log("user.Id:", this.user.Id);
            console.log("user.Name:", this.user.Name);
            console.log("title:", this.title);
            console.log("content", this.content);

            // 清空标题和内容
            this.title = '';
           quillInstance.setContents("")
          }
        } else {
          this.dialogTitle = '失败';
          this.dialogMessage = '文章发布失败，请重试。';
          this.dialogVisible = true;
        }
      } catch (error) {
        console.log('Error publishing blog:', error);
      }
    },
    updateCurrentTime() {
      const dt = new Date();
      const y = dt.getFullYear();
      const mt = dt.getMonth() + 1;
      const day = dt.getDate();
      const h = dt.getHours();
      const m = dt.getMinutes();
      const s = dt.getSeconds();
      this.currentTime = `${y}年${mt}月${day}日-${h}时${m}分${s}秒`;
    },
  },
  created() {
    this.updateCurrentTime();
    this.timer = setInterval(() => {
      this.updateCurrentTime();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style scoped>
.container{
  width: 100%;
  height: 100%;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}
#card {
  width: 2000px;
  margin: 20px 60px 20px 90px;
  height: 1000px;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  justify-items: center;
}

.blog-editor {
  width: 100%;
  height: 720px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
