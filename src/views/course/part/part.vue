<template>
  <div class="module-container">
    <div class="search">
      <input type="text" v-model="searchKey" placeholder="输入内容关键字">
      <span>搜索</span>
    </div>
    <div class="form-list">
      <table class="selfTable">
        <thead>
          <tr class="selfTableHeader">
            <th>No.</th>
            <th>Slide</th>
            <th>Form</th>
            <th>Form Type</th>
            <th style="width: 200px">Content</th>
            <th style="width: 200px">Options</th>
            <th>Picture</th>
            <th>Voice</th>
            <th></th>
          </tr>
        </thead>
        <tbody :style="{'height': theight + 'px'}">
          <tr class="selfTableRow">
            <td class="selfTableCell">1</td>
            <td class="selfTableCell">1</td>
            <td class="selfTableCell">1-1</td>
            <td class="selfTableCell">填空</td>
            <td class="selfTableCell" style="width: 200px"><input type="text" value="What are you doing?"></td>
            <td class="selfTableCell" style="width: 200px"><input type="text" value="What/How/Where"></td>
            <td class="selfTableCell"><el-image class="cover" src="http://course-assets.talkmate.com/kidCourseRes/combg/9.webp?v=qoiuoiewurpooo" fit="fit"></el-image></td>
            <td class="selfTableCell"><div class="voice"><i></i></div></td>
            <td class="selfTableCell"><i class="el-icon-close"></i></td>
          </tr>
          <tr class="selfTableRow">
            <td class="selfTableCell">2</td>
            <td class="selfTableCell">1</td>
            <td class="selfTableCell">1-2</td>
            <td class="selfTableCell">填空</td>
            <td class="selfTableCell" style="width: 200px"><input type="text" value="What is your name? "></td>
            <td class="selfTableCell" style="width: 200px"><input type="text" value="What/How/Where"></td>
            <td class="selfTableCell">
              <el-image class="cover">
                <div slot="error" class="cover-error">
                  <i></i>
                </div>
              </el-image>
            </td>
            <td class="selfTableCell"><div class="voice"><i></i></div></td>
            <td class="selfTableCell"><i class="el-icon-close"></i></td>
          </tr>
          <tr class="selfTableRow">
            <td class="operate" colspan="9">
              <a href="javascript:;" class="operate-item">预览</a>
              <a href="javascript:;" class="operate-item">移动</a>
              <a href="javascript:;" class="operate-item">删除</a>
            </td>
          </tr>
          <tr class="selfTableRow">
            <td class="selfTableCell">1</td>
            <td class="selfTableCell">1</td>
            <td class="selfTableCell">1-1</td>
            <td class="selfTableCell">填空</td>
            <td class="selfTableCell" style="width: 200px"><input type="text" value="What are you doing?"></td>
            <td class="selfTableCell" style="width: 200px"><input type="text" value="What/How/Where"></td>
            <td class="selfTableCell"><el-image class="cover" src="http://course-assets.talkmate.com/kidCourseRes/combg/9.webp?v=qoiuoiewurpooo" fit="fit"></el-image></td>
            <td class="selfTableCell"><div class="voice"><i></i></div></td>
            <td class="selfTableCell"><i class="el-icon-close"></i></td>
          </tr>
          <tr class="selfTableRow">
            <td class="selfTableCell">2</td>
            <td class="selfTableCell">1</td>
            <td class="selfTableCell">1-2</td>
            <td class="selfTableCell">填空</td>
            <td class="selfTableCell" style="width: 200px"><input type="text" value="What is your name? "></td>
            <td class="selfTableCell" style="width: 200px"><input type="text" value="What/How/Where"></td>
            <td class="selfTableCell">
              <el-image class="cover">
                <div slot="error" class="cover-error">
                  <i></i>
                </div>
              </el-image>
            </td>
            <td class="selfTableCell"><div class="voice"><i></i></div></td>
            <td class="selfTableCell"><i class="el-icon-close"></i></td>
          </tr>
          <tr class="selfTableRow">
            <td class="operate" colspan="9">
              <a href="javascript:;" class="operate-item">预览</a>
              <a href="javascript:;" class="operate-item">移动</a>
              <a href="javascript:;" class="operate-item">删除</a>
            </td>
          </tr>
          <tr class="selfTableRow">
            <td class="selfTableCell">1</td>
            <td class="selfTableCell">1</td>
            <td class="selfTableCell">1-1</td>
            <td class="selfTableCell">填空</td>
            <td class="selfTableCell" style="width: 200px"><input type="text" value="What are you doing?"></td>
            <td class="selfTableCell" style="width: 200px"><input type="text" value="What/How/Where"></td>
            <td class="selfTableCell"><el-image class="cover" src="http://course-assets.talkmate.com/kidCourseRes/combg/9.webp?v=qoiuoiewurpooo" fit="fit"></el-image></td>
            <td class="selfTableCell"><div class="voice"><i></i></div></td>
            <td class="selfTableCell"><i class="el-icon-close"></i></td>
          </tr>
          <tr class="selfTableRow">
            <td class="selfTableCell">2</td>
            <td class="selfTableCell">1</td>
            <td class="selfTableCell">1-2</td>
            <td class="selfTableCell">填空</td>
            <td class="selfTableCell" style="width: 200px"><input type="text" value="What is your name? "></td>
            <td class="selfTableCell" style="width: 200px"><input type="text" value="What/How/Where"></td>
            <td class="selfTableCell">
              <el-image class="cover">
                <div slot="error" class="cover-error">
                  <i></i>
                </div>
              </el-image>
            </td>
            <td class="selfTableCell"><div class="voice"><i></i></div></td>
            <td class="selfTableCell"><i class="el-icon-close"></i></td>
          </tr>
          <tr class="selfTableRow">
            <td class="operate" colspan="9">
              <a href="javascript:;" class="operate-item">预览</a>
              <a href="javascript:;" class="operate-item">移动</a>
              <a href="javascript:;" class="operate-item">删除</a>
            </td>
          </tr>
          <tr class="selfTableRow">
            <td class="selfTableCell">1</td>
            <td class="selfTableCell">1</td>
            <td class="selfTableCell">1-1</td>
            <td class="selfTableCell">填空</td>
            <td class="selfTableCell" style="width: 200px"><input type="text" value="What are you doing?"></td>
            <td class="selfTableCell" style="width: 200px"><input type="text" value="What/How/Where"></td>
            <td class="selfTableCell"><el-image class="cover" src="http://course-assets.talkmate.com/kidCourseRes/combg/9.webp?v=qoiuoiewurpooo" fit="fit"></el-image></td>
            <td class="selfTableCell"><div class="voice"><i></i></div></td>
            <td class="selfTableCell"><i class="el-icon-close"></i></td>
          </tr>
          <tr class="selfTableRow">
            <td class="selfTableCell">2</td>
            <td class="selfTableCell">1</td>
            <td class="selfTableCell">1-2</td>
            <td class="selfTableCell">填空</td>
            <td class="selfTableCell" style="width: 200px"><input type="text" value="What is your name? "></td>
            <td class="selfTableCell" style="width: 200px"><input type="text" value="What/How/Where"></td>
            <td class="selfTableCell">
              <el-image class="cover">
                <div slot="error" class="cover-error">
                  <i></i>
                </div>
              </el-image>
            </td>
            <td class="selfTableCell"><div class="voice"><i></i></div></td>
            <td class="selfTableCell"><i class="el-icon-close"></i></td>
          </tr>
          <tr class="selfTableRow">
            <td class="operate" colspan="9">
              <a href="javascript:;" class="operate-item">预览</a>
              <a href="javascript:;" class="operate-item">移动</a>
              <a href="javascript:;" class="operate-item">删除</a>
            </td>
          </tr>
          <tr class="selfTableRow">
            <td class="selfTableCell">1</td>
            <td class="selfTableCell">1</td>
            <td class="selfTableCell">1-1</td>
            <td class="selfTableCell">填空</td>
            <td class="selfTableCell" style="width: 200px"><input type="text" value="What are you doing?"></td>
            <td class="selfTableCell" style="width: 200px"><input type="text" value="What/How/Where"></td>
            <td class="selfTableCell"><el-image class="cover" src="http://course-assets.talkmate.com/kidCourseRes/combg/9.webp?v=qoiuoiewurpooo" fit="fit"></el-image></td>
            <td class="selfTableCell"><div class="voice"><i></i></div></td>
            <td class="selfTableCell"><i class="el-icon-close"></i></td>
          </tr>
          <tr class="selfTableRow">
            <td class="selfTableCell">2</td>
            <td class="selfTableCell">1</td>
            <td class="selfTableCell">1-2</td>
            <td class="selfTableCell">填空</td>
            <td class="selfTableCell" style="width: 200px"><input type="text" value="What is your name? "></td>
            <td class="selfTableCell" style="width: 200px"><input type="text" value="What/How/Where"></td>
            <td class="selfTableCell">
              <el-image class="cover">
                <div slot="error" class="cover-error">
                  <i></i>
                </div>
              </el-image>
            </td>
            <td class="selfTableCell"><div class="voice"><i></i></div></td>
            <td class="selfTableCell"><i class="el-icon-close"></i></td>
          </tr>
          <tr class="selfTableRow">
            <td class="operate" colspan="9">
              <a href="javascript:;" class="operate-item">预览</a>
              <a href="javascript:;" class="operate-item">移动</a>
              <a href="javascript:;" class="operate-item">删除</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="btns">
      <a href="javascript:;" class="btn outline">导入</a>
      <a href="javascript:;" class="btn primary">新增</a>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchKey: '',
      theight: 0
    }
  },
  mounted () {
    let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    this.theight = h - 370
  }
}
</script>

<style lang="scss" scoped>
.module-container {
  padding: 20px 40px;
}
.search {
  text-align: right;
  padding-right: 40px;
  input {
    width: 200px;
    height: 30px;
    background: #fff;
    border-radius: 16px;
    border: 0;
    padding-left: 20px;
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
    color: #000;
    margin-right: 16px;
  }
  input::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color: rgba($color: #000000, $alpha: 0.4);
  }
  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: rgba($color: #000000, $alpha: 0.4);
  }
  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: rgba($color: #000000, $alpha: 0.4);
  }
  input:-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: rgba($color: #000000, $alpha: 0.4);
  }
  input::-ms-input-placeholder { /* Microsoft Edge */
    color: rgba($color: #000000, $alpha: 0.4);
  }
}
.form-list {
  margin-top: 20px;
}
.cover {
  width: 45px;
  height: 30px;
  display: block;
  .cover-error {
    i {
      width: 45px;
      height: 30px;
      display: inline-block;
      background-image: url('../../../assets/images/course/icon-cover-error.png');
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
}
.voice {
  i {
    width: 15px;
    height: 15px;
    display: inline-block;
    background-image: url('../../../assets/images/course/icon-voice.png');
    background-repeat: no-repeat;
    background-size: cover;
  }
}

.operate {
  background: #F5F6FA;
  width: 100%;
  height: 20px;
  padding-right: 20px;
  text-align: right;
  margin: 10px;
  .operate-item {
    margin: 0 10px;
    font-size: 12px;
    font-weight: 400;
    color:rgba($color: #000000, $alpha: 0.6);
    line-height: 14px;
  }
}

.btns {
  margin: 50px 0;
}
</style>
