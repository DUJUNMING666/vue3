<template>
  <v-list>
    <v-list-item v-for="reply in replies" :key="reply.Id">
      <v-list-item-title>{{ reply.Name }}：{{ reply.Time }}</v-list-item-title>
      <v-list-item-subtitle class="comment-content">{{ reply.Comment }}</v-list-item-subtitle>
      <v-btn class="comment-btn" icon @click="showCommentInput(reply)">
        <v-icon>mdi-comment-outline</v-icon>
      </v-btn>
    </v-list-item>
    <!-- 递归显示嵌套回复 -->
    <Reply v-if="reply.replies && reply.replies.length" :replies="reply.replies" :showCommentInput="showCommentInput" />
  </v-list>
</template>

<script>
export default {
  name: 'Reply',
  props: {
    replies: Array,
    showCommentInput: Function,
  },
};
</script>

<style scoped>
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
