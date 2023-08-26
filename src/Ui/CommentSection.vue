<template>
  <div>
    <v-list>
      <v-list-item v-for="item in commentList" :key="item.Id">
        <v-list-item>
          <v-list-item-title class="commenter-name">{{ item.Name }}：{{item.Time}}</v-list-item-title>
          <v-list-item-subtitle class="comment-content">{{ truncateComment(item.Comment) }}</v-list-item-subtitle>
          <v-btn class="comment-btn" icon @click="showCommentInput(item)">
            <v-icon>mdi-comment-outline</v-icon>
          </v-btn>
        </v-list-item>
      </v-list-item>
      <v-divider></v-divider>
    </v-list>
    <!-- 评论输入框 -->
    <v-textarea ref="commentInput" v-model="inputComment" :placeholder="placeholders" :rows="3" outlined dense class="comment-input" max-height="150px" />
    <v-row justify="end">
      <v-btn @click="cancel" text class="mr-2">取消</v-btn>
      <v-btn @click="commitComment" color="primary" class="mr-0">确定</v-btn>
    </v-row>
  </div>
</template>

<script>
import Reply from './Reply.vue';
import axios from "axios";

export default {
  inject: ['store'], // 注入 Vuex Store
  components: {
    Reply,
  },
  name: 'CommentSection',
  props: {
    articleId:"",
    fatherId:""
  },
  data() {
    return {
      commentList:[],
      inputComment: '',
      placeholders: '写下你的评论',
      time: "",
      fatherId: "",
    };
  },
  methods: {
    showCommentInput(comment) {
      this.fatherId = comment.Id;
      this.placeholders = `@${comment.Name} `;
      this.$refs.commentInput.focus(); // 将焦点定位到评论输入框
    },
    getReplies(parentId) {
      return this.commentList.filter(comment => comment.FatherId === parentId);
    },
    async commitComment() {
      const Comment = this.inputComment.trim();
      if (Comment !== "") {
        this.updateCurrentTime(); // 更新时间
        const postData = {
          articleid: this.articleId,
          comment: Comment,
          fatherid: this.fatherId, // 使用父评论的 Id
          time: this.time,
          id: this.store.state.user.Id,
          name: this.store.state.user.Name
        };
        try {
          const response = await axios.post('/api/createComment', postData);
          if (response.data.success) {
            this.inputComment = '';
            this.placeholders = '写下你的评论';
            // 如果回复成功，重新获取评论列表刷新页面
            await this.fetchComments();
          }
        } catch (error) {
          console.error('Error creating comment:', error);
        }
      } else {
        alert("评论不能为空");
      }
    },
    cancel() {
      this.inputComment = '';
      this.placeholders = '写下你的评论';
    },
    updateCurrentTime() {
      const dt = new Date();
      const y = dt.getFullYear();
      const mt = dt.getMonth() + 1;
      const day = dt.getDate();
      const h = dt.getHours();
      const m = dt.getMinutes();
      const s = dt.getSeconds();
      this.time = `${y}年${mt}月${day}日-${h}时${m}分${s}秒`;
    },
    async fetchComments() {
      try {
        const response = await axios.get('/api/getComment', { params: { articleId: this.articleId, _t: Date.now() } });
        this.commentList = response.data.map(comment => ({
          ...comment,
          replies: [], // 初始化父评论的回复列表
        }));
        this.commentList.forEach(comment => {
          comment.replies = this.getReplies(comment.Id); // 获取父评论的回复列表
        });
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
    truncateComment(comment) {
      // 截断过长的评论内容，显示省略号
      const maxLength = 100;
      if (comment.length > maxLength) {
        return comment.substring(0, maxLength) + '...';
      }
      return comment;
    },
  },
  mounted() {
    this.fetchComments();
    this.updateCurrentTime();
  }
};
</script>

<style scoped>
.commenter-name {
  color: #2d9aff;
}
.comment-input {
  width: 100%;
}
.comment-content {
  max-height: 1000px;
  overflow-x: auto;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: black;
  font-style: normal;
  font-size: 20px;
}
.comment-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 8px;
}
</style>
