<template>
  <dvi id="center">
    <v-card id="card">
      <v-card v-for="article in articles" :key="article.Id" id="articlecard">
        <v-card-title class="headline" style="font-size: 22px">{{ article.ArticleName }}
          <div class="article-details">
            <div class="article-info">
              <p>作者: {{ article.AuthorName }}</p>
              <p>时间: {{ article.SubTime }}</p>
            </div>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <p v-html="article.Content" class="article-content"></p>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="primary" @click="toggleComment(article.ArticleId)">评论区</v-btn>
        </v-card-actions>
        <div v-if=" showCommentId.includes(article.ArticleId)" class="comment-card">
          <comment :articleId="article.ArticleId" :fatherId="article.AuthorId" />
        </div>
      </v-card>
    </v-card>
  </dvi>
</template>

<script>
import axios from 'axios';
import comment from "./CommentSection.vue";

export default {
  components: {comment},
  data() {
    return {
      maxCharsPerLine: 30, // 设置每行最大字数
      articles: [],
      showCommentId:[],
    };
  },
  methods: {
    async fetchArticles() {
      try {
        const response = await axios.get('/api/article');
        this.articles = response.data;
        console.log(this.articles)
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    },
    toggleComment(articleId) {
      if (this.showCommentId.includes(articleId)) {
        this.showCommentId = this.showCommentId.filter(id => id !== articleId);
      } else {
        this.showCommentId.push(articleId);
      }
    },
  },
  mounted() {
    this.fetchArticles();
    console.log(this.articles);
  },
};
</script>

<style scoped>
#card {
  width: 100%;
  height: calc(100vh - 64px);
  background: #e1d7d7;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

#articlecard {
  height: auto;
  width: 80%;
  margin: 20px auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: whitesmoke;
  overflow: auto;
}

.article-details {
  display: flex;
  justify-content: space-between;
}

.article-content {
  font-size: 18px;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.comment-card {
  background: transparent;
  display:inline-block;
  margin: 20px;
  width: 80%;
  height: auto;
}
</style>
