<template>
  <div class="model-pro-container" v-show="isShow">
    <div class="top-bar">
      <div class="left">
        路径：{{ pathDesc }}
      </div>
      <div class="right">
        <el-button type="text" @click="addForm">新增</el-button>
        <el-button type="text" @click="lookPreview">预览</el-button>
      </div>
    </div>
    <div id="forms" @contextmenu="contentmenu" class="forms">
      <div class="list" id="sort-form" v-if="contentModel == 'content_model_video'">
        <form-video
          :style="{ height: formHeight + 'px' }"
          :data-id="index"
          :class="{'active': activeFormIndex == index}"
          v-for="(content, index) in contents"
          :key="index"
          :form="content"
          :formIndex="index"
          @delForm="delForm"
          @switchForm="switchForm"/>
      </div>
      <div class="list" id="sort-form" v-else-if="contentModel == 'content_model_kid_test'">
        <form-kid-test
          :data-id="index"
          :class="{'active': activeFormIndex == index}"
          v-for="(content, index) in contents"
          :key="index"
          :form="content"
          :formIndex="index"
          @delForm="delForm"
          @switchForm="switchForm"/>
      </div>
      <div class="list" id="sort-form" v-else-if="contentModel == 'content_model_level_grade'">
        <form-level-grade
          :data-id="index"
          :class="{'active': activeFormIndex == index}"
          v-for="(content, index) in contents"
          :key="index"
          :form="content"
          :formIndex="index"
          @delForm="delForm"
          @switchForm="switchForm"/>
      </div>
      <div class="list" id="sort-form" v-else-if="contentModel == 'content_model_listen_spelling'">
        <form-listen-spelling
          :data-id="index"
          :class="{'active': activeFormIndex == index}"
          v-for="(content, index) in contents"
          :key="index"
          :form="content"
          :formIndex="index"
          @delForm="delForm"
          @switchForm="switchForm"/>
      </div>
      <div class="list" id="sort-form" v-else-if="contentModel == 'content_model_intertranslation'">
        <form-intertranslation
          :data-id="index"
          :class="{'active': activeFormIndex == index}"
          v-for="(content, index) in contents"
          :key="index"
          :form="content"
          :formIndex="index"
          @delForm="delForm"
          @switchForm="switchForm"/>
      </div>
      <div class="list" id="sort-form" v-else-if="contentModel == 'content_model_writing_training'">
        <form-writing-training
          :data-id="index"
          :class="{'active': activeFormIndex == index}"
          v-for="(content, index) in contents"
          :key="index"
          :form="content"
          :formIndex="index"
          @delForm="delForm"
          @switchForm="switchForm"/>
      </div>
      <div class="list" id="sort-form" v-else-if="contentModel == 'content_model_vocabulary_comprehension'">
        <form-vocabulary-comprehension
          :data-id="index"
          :class="{'active': activeFormIndex == index}"
          v-for="(content, index) in contents"
          :key="index"
          :form="content"
          :formIndex="index"
          @delForm="delForm"
          @switchForm="switchForm"/>
      </div>
      <div class="list" id="sort-form" v-else-if="contentModel == 'content_model_reading_comprehension'">
        <form-reading-comprehension
          :data-id="index"
          :class="{'active': activeFormIndex == index}"
          v-for="(content, index) in contents"
          :key="index"
          :form="content"
          :formIndex="index"
          @delForm="delForm"
          @switchForm="switchForm"/>
      </div>
      <div class="list" id="sort-form" v-else-if="contentModel == 'content_model_read_in_role'">
        <form-read-role
          :data-id="index"
          :class="{'active': activeFormIndex == index}"
          v-for="(content, index) in contents"
          :key="index"
          :form="content"
          :formIndex="index"
          @delForm="delForm"
          @switchForm="switchForm"/>
      </div>
      <div class="list" id="sort-form" v-else-if="contentModel == 'content_model_listening_choice'">
        <form-listening-choice
          :data-id="index"
          :class="{'active': activeFormIndex == index}"
          v-for="(content, index) in contents"
          :key="index"
          :form="content"
          :formIndex="index"
          @delForm="delForm"
          @switchForm="switchForm"/>
      </div>
      <div class="list" id="sort-form" v-else-if="contentModel == 'content_model_dubbing_repeat'">
        <form-dubbing-repeat
          :data-id="index"
          :class="{'active': activeFormIndex == index}"
          v-for="(content, index) in contents"
          :key="index"
          :form="content"
          :formIndex="index"
          @delForm="delForm"
          @switchForm="switchForm"/>
      </div>
      <div class="list" id="sort-form" v-else-if="contentModel == 'content_model_rubbing_ear'">
        <form-rubbing-ear
          :data-id="index"
          :class="{'active': activeFormIndex == index}"
          v-for="(content, index) in contents"
          :key="index"
          :form="content"
          :formIndex="index"
          @delForm="delForm"
          @switchForm="switchForm"/>
      </div>
      <div class="list" id="sort-form" v-else-if="contentModel == 'content_model_listen_read'">
        <form-listen-read
          :data-id="index"
          :class="{'active': activeFormIndex == index}"
          v-for="(content, index) in contents"
          :key="index"
          :form="content"
          :formIndex="index"
          @delForm="delForm"
          @switchForm="switchForm"/>
      </div>
      <div class="list" id="sort-form" v-else>
        <form-comp
          :data-id="index"
          :class="{'active': activeFormIndex == index}"
          v-for="(content, index) in contents"
          :key="index"
          :form="content"
          :formIndex="index"
          @delForm="delForm"
          @switchForm="switchForm"/>
      </div>
    </div>
    <el-form id="form-model" ref="form" v-if="contents && contents.length" :model="contents[activeFormIndex]" label-width="80px">
      <div class="item" v-for="f in feilds" :key="f.feild">
        <el-form-item label-width="140px" :label="f.name" v-if="(f.data_from !== 'part_of_speech' && f.data_from !== 'content_types' && f.feild !== 'list_order' && f.type !== 'template' && f.type !== 'templateArray' && f.feild !== 'sentence_phoneticize' && f.feild !== 'options_phoneticize') || (f.type == 'template' && contents[activeFormIndex]['' + f.feild + '']) || ((version['selLang'] == 'JPN' || version['selLang'] == 'CHI') && (f.feild == 'sentence_phoneticize' || f.feild == 'options_phoneticize')) || (f.feild === 'options' && f.type == 'array' && contents[activeFormIndex][f.feild])">
          <!-- string 或 int -->
          <el-input
            :maxlength="500" show-word-limit
            v-if="(f.type == 'string' && f.data_from == '') || f.type == 'int' || f.type == 'template'"
            v-model="contents[activeFormIndex]['' + f.feild + '']"
            :disabled="f.feild == 'list_order' || f.type == 'template'">
          </el-input>
          <!-- stringOptions -->
          <el-input
            :maxlength="150" show-word-limit
            v-if="f.type == 'stringOptions'"
            @change="changeStringOptions(f.feild)"
            v-model="contents[activeFormIndex]['' + f.feild + '']">
          </el-input>
          <!-- string && upload -->
          <el-input placeholder="请输入内容" v-if="f.type == 'string' && f.data_from.indexOf('upload_') > -1" :maxlength="150" show-word-limit  v-model="contents[activeFormIndex]['' + f.feild + '']">
            <el-upload slot="prepend"
              v-if="f.data_from.indexOf('upload_') > -1"
              action="#"
              :accept="f.data_from == 'upload_audio' ? 'audio/mp3' : (f.data_from == 'upload_video' ? 'video/mp4' : 'image/webp')"
              :on-change="uploadOnchange"
              :show-file-list="false"
              :auto-upload="false">
              <el-tooltip class="item" effect="dark" content="点击图标上传" placement="top">
                <el-button type="text" @click="upload(f, -1)">
                  <i :class="['icon-input', f.data_from.toLowerCase().indexOf('audio') > -1 ? 'icon-sound' : (f.data_from.toLowerCase().indexOf('video') > -1) ? 'icon-video' : 'icon-picture']"></i>
                </el-button>
              </el-tooltip>
            </el-upload>
            <el-button slot="append" v-if="f.data_from == 'upload_audio' && f.feild == 'motherSound'" @click="motherSoundPlay(contents[activeFormIndex]['' + f.feild + ''])">试听</el-button>
            <i slot="suffix" class="el-input__icon el-icon-download" @click="download(contents[activeFormIndex]['' + f.feild + ''])"></i>
          </el-input>
          <el-button v-if="f.data_from == 'upload_audio' && f.feild == 'sound'" type="text" @click="toggleRecorder">在线录音</el-button>
          <audio-recorder ref="recorder" @saveRecorder="saveRecorder" v-if="f.data_from == 'upload_audio'"/>
          <!-- text -->
          <el-input
            v-if="f.type == 'text'"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="contents[activeFormIndex]['' + f.feild + '']">
          </el-input>
          <!-- textOptions -->
          <el-input
            v-if="f.type == 'textOptions'"
            @change="changeTextOptions(f.feild)"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="contents[activeFormIndex]['' + f.feild + '']">
          </el-input>
          <!-- textRadar -->
          <el-input
            v-if="f.type == 'textRadar'"
            @change="changeTextRadar(f.feild)"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="contents[activeFormIndex]['' + f.feild + '']">
          </el-input>
          <!-- 标签 -->
          <el-checkbox-group v-if="f.data_from == 'content_tags'" v-model="contents[activeFormIndex]['' + f.feild + '']">
            <el-checkbox v-for="item in selfContentTags" :key="item.key" :label="item.key">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
          <!-- <div class="options" v-if="f.feild === 'options' && (contents[activeFormIndex]['type'] == 'makeSentence' || contents[activeFormIndex]['type'] == 'fillGap')">
            <div class="option-list">
              <div class="option-item" v-for="(item, index) in contents[activeFormIndex]['' + f.feild + '']" :key="index">
                <input type="text" v-model="contents[activeFormIndex]['' + f.feild + ''][index]">
                <i class="el-icon-circle-close" @click="delOption(f, index)"></i>
              </div>
            </div>
            <div class="add-option" @click="addOption(f)">
              <i class="el-icon-plus"></i>
            </div>
            <el-tag type="warning" v-show="contents[activeFormIndex]['type'] == 'fillGap'">注：第一个输入项为正确选项，其他为错误选项。</el-tag>
          </div> -->
          <!-- bool -->
          <el-radio-group v-if="f.type == 'bool'" v-model="contents[activeFormIndex]['' + f.feild + '']">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
          <!-- 打标记 radio_ -->
          <div class="self-sign" v-if="f.feild == 'self_sign'">
            <el-tag
              :effect="contents[activeFormIndex]['' + f.feild + ''] == sign.key ? 'dark' : 'plain'"
              v-for="(sign, index) in selfSigns"
              :key="sign.type + index"
              :type="sign.type" @click="selOneSign(sign)">
              {{ sign.desc }}
            </el-tag>
          </div>
          <!-- 图片声音-->
          <div class="form-sound" v-if="f.data_from.indexOf('upload_') === -1 && f.type == 'string' && (f.feild == 'sound' || f.feild == 'image' || f.feild == 'cover' || f.feild == 'video')">
            <el-input v-model="contents[activeFormIndex]['' + f.feild + '']" :placeholder="f.feild == 'sound' ? '请上传mp3格式的音频' : ''">
              <el-upload
                slot="prepend"
                v-if="f.feild == 'sound'"
                action="#"
                accept="audio/mp3"
                :on-change="uploadSoundOnchange"
                :show-file-list="false"
                :auto-upload="false">
                <el-tooltip class="item" effect="dark" content="点击图标上传" placement="top">
                  <el-button type="text">
                    <i :class="['icon-input', f.data_from.toLowerCase().indexOf('audio') > -1 ? 'icon-sound' : (f.data_from.toLowerCase().indexOf('video') > -1) ? 'icon-video' : 'icon-picture']"></i>
                  </el-button>
                </el-tooltip>
              </el-upload>
              <el-upload
                slot="prepend"
                v-if="f.feild == 'video'"
                action="#"
                accept="video/mp4"
                :on-change="uploadVideoOnchange"
                :show-file-list="false"
                :auto-upload="false">
                <el-tooltip class="item" effect="dark" content="点击图标上传" placement="top">
                  <el-button type="text">
                    <i :class="['icon-input', f.data_from.toLowerCase().indexOf('audio') > -1 ? 'icon-sound' : (f.data_from.toLowerCase().indexOf('video') > -1) ? 'icon-video' : 'icon-picture']"></i>
                  </el-button>
                </el-tooltip>
              </el-upload>
              <el-upload
                slot="prepend"
                v-if="f.feild == 'image'"
                action="#"
                accept="image/webp"
                :on-change="uploadImageOnchange"
                :show-file-list="false"
                :auto-upload="false">
                <el-tooltip class="item" effect="dark" content="点击图标上传" placement="top">
                  <el-button type="text">
                    <i :class="['icon-input', f.data_from.toLowerCase().indexOf('audio') > -1 ? 'icon-sound' : (f.data_from.toLowerCase().indexOf('video') > -1) ? 'icon-video' : 'icon-picture']"></i>
                  </el-button>
                </el-tooltip>
              </el-upload>
              <el-upload
                v-if="f.feild == 'cover'"
                action="#"
                accept="image/webp"
                :on-change="uploadCoverOnchange"
                :show-file-list="false"
                :auto-upload="false">
                <el-button type="text">本地上传</el-button>
              </el-upload>
              <el-button slot="append" @click="clear(f.feild)">清除</el-button>
            </el-input>
            <div class="upload-area">
              <el-button v-if="contentModel == 'content_model_pro_sound' && f.feild == 'image'" type="text" @click="searchContent(f.feild)">内容查找</el-button>
              <el-button v-if="contentModel == 'content_model_pro_sound' && f.feild == 'image'" type="text" @click="searchImg('images')">图库查找</el-button>
            </div>
            <look-image
              v-if="contentModel == 'content_model_pro_sound' && f.feild == 'image' && activeFeild == 'images'"
              @close="closeLook"
              @use="use"/>
            <look-content
              :contentModel="contentModel"
              :activeFeild="activeFeild"
              v-if="contentModel == 'content_model_pro_sound' && f.feild == activeFeild"
              @close="closeLook"
              @use="use"/>
          </div>
          <!-- 字符串数组 -->
          <div class="array-string" v-if="f.type == 'array' && (f.data_from == '' || f.data_from.indexOf('upload_') > -1) ">
            <div class="list" v-if="contents[activeFormIndex]['' + f.feild + ''] && contents[activeFormIndex]['' + f.feild + ''].length">
              <el-input placeholder="请输入内容"
                :maxlength="150"
                show-word-limit
                v-for="(item, index) in contents[activeFormIndex]['' + f.feild + '']" :key="f.feild + index" v-model="contents[activeFormIndex]['' + f.feild + ''][index]">
                <el-upload slot="prepend"
                  v-if="f.data_from.indexOf('upload_') > -1"
                  action="#"
                  :accept="f.data_from == 'upload_audio' ? 'audio/mp3' : 'image/webp'"
                  :on-change="uploadOnchange"
                  :show-file-list="false"
                  :auto-upload="false">
                  <el-button type="text" @click="upload(f, index)">上传</el-button>
                </el-upload>
                <el-button slot="append" icon="el-icon-minus" @click="minus(index, f.feild)"></el-button>
                <el-button v-show="index == contents[activeFormIndex]['' + f.feild + ''].length - 1" slot="append" icon="el-icon-plus" @click="plus('string', f)"></el-button>
              </el-input>
              <el-tag type="warning" v-show="f.feild == 'options' && contents[activeFormIndex]['type'] == 'fillGap'">注：第一个输入项为正确选项，其他为错误选项。</el-tag>
            </div>
            <div class="list" v-else>
              <el-button type="info" plain @click="plus('string', f)">添加一条内容</el-button>
            </div>
          </div>
          <!-- 对象数组 -->
          <div class="array-object" v-if="f.type == 'arrayObject'">
            <div class="list" v-if="contents[activeFormIndex]['' + f.feild + ''] && contents[activeFormIndex]['' + f.feild + ''].length">
              <div class="object-item" v-for="(item, index) in contents[activeFormIndex]['' + f.feild + '']" :key="index">
                <div class="num">
                  <el-badge :value="index + 1" class="item" type="primary">
                  </el-badge>
                </div>
                <div class="left" v-if="f.sub_feilds && f.sub_feilds.length > 0">
                  <div class="sub-item" v-for="(subItem, i) in f.sub_feilds" :key="'subItem' + i">
                    <el-form-item size="small" :label="subItem.name" v-if="subItem.type == 'string' || subItem.type == 'text'">
                      <!-- string -->
                      <el-input  v-if="!subItem.data_from && subItem.type == 'string'" v-model="contents[activeFormIndex]['' + f.feild + ''][index]['' + subItem.feild + '']"></el-input>
                      <!-- textarea -->
                      <el-input  v-if="!subItem.data_from && subItem.type == 'text'" type="textarea" v-model="contents[activeFormIndex]['' + f.feild + ''][index]['' + subItem.feild + '']"></el-input>
                      <!-- upload -->
                      <el-input placeholder="请输入内容" v-if="subItem.data_from && subItem.data_from.indexOf('upload_') > -1" :maxlength="150" show-word-limit  v-model="contents[activeFormIndex]['' + f.feild + ''][index]['' + subItem.feild + '']">
                        <el-upload slot="prepend"
                          v-if="subItem.data_from.indexOf('upload_') > -1"
                          action="#"
                          :accept="subItem.data_from == 'upload_audio' ? 'audio/mp3' : (subItem.data_from == 'upload_video' ? 'video/mp4' : 'image/webp')"
                          :on-change="uploadOnchangeSub"
                          :show-file-list="false"
                          :auto-upload="false">
                          <el-button type="text" @click="uploadSub(f, -1, index, subItem)">上传</el-button>
                        </el-upload>
                        <el-button slot="append" v-if="subItem.data_from == 'upload_audio'" @click="motherSoundPlay(contents[activeFormIndex]['' + f.feild + ''][index]['' + subItem.feild + ''])">试听</el-button>
                      </el-input>
                    </el-form-item>
                    <!-- array options -->
                    <el-form-item size="small" :label="subItem.name" v-if="subItem.type == 'array'">
                      <div class="sub-item-options" v-if="contents[activeFormIndex]['' + f.feild + ''][index]['' + subItem.feild + ''] && contents[activeFormIndex]['' + f.feild + ''][index]['' + subItem.feild + ''].length > 0">
                        <div class="sub-item-option" v-for="(o, oi) in contents[activeFormIndex]['' + f.feild + ''][index]['' + subItem.feild + '']" :key="oi">
                          <div class="sub-item-input">
                            <el-input v-model="contents[activeFormIndex]['' + f.feild + ''][index]['' + subItem.feild + ''][oi]"></el-input>
                          </div>
                          <div class="sub-item-operate">
                            <el-button icon="el-icon-minus" @click="minusSubItem(f, subItem, index, oi)" circle></el-button>
                            <el-button icon="el-icon-plus" v-if="contents[activeFormIndex]['' + f.feild + ''][index]['' + subItem.feild + ''].length - 1 == oi" circle @click="addSubItem(f, subItem, index)"></el-button>
                          </div>
                        </div>
                      </div>
                      <div v-else>
                        <el-button @click="addSubItem(f, subItem, index)" round>添加</el-button>
                      </div>
                    </el-form-item>
                  </div>
                </div>
                <div class="left" v-else>
                  <div class="row">
                    <div class="text">{{f.data_from ? f.data_from.split(',')[0].split('_')[0] + '：' : 'key：' }}</div>
                    <div class="text-input">
                      <el-input :type="(f.data_from && f.data_from.split(',')[0].indexOf('_1') > -1) ? 'textarea': 'text'" v-model="contents[activeFormIndex]['' + f.feild + ''][index]['key']" size="small"></el-input>
                    </div>
                  </div>
                  <div class="row">
                    <div class="text">{{f.data_from ? f.data_from.split(',')[1].split('_')[0] + '：' : 'val：' }}</div>
                    <div class="text-input">
                      <el-input :type="(f.data_from && f.data_from.split(',')[1].indexOf('_1') > -1) ? 'textarea': 'text'" v-model="contents[activeFormIndex]['' + f.feild + ''][index]['val']" size="small"></el-input>
                    </div>
                  </div>
                </div>
                <div class="right">
                  <el-button size="small" type="info" plain icon="el-icon-minus" @click="minus(index, f.feild)"></el-button>
                  <el-button size="small" v-show="index == contents[activeFormIndex]['' + f.feild + ''].length - 1" type="info" plain icon="el-icon-plus" @click="plus('object', f)"></el-button>
                </div>
              </div>
            </div>
            <div class="list" v-else>
              <el-button type="info" plain @click="plus('object', f)">添加一条{{contents[activeFormIndex]['' + f.data_from + ''] == 1 ? 'k/v的' : '' }}内容</el-button>
            </div>
          </div>
          <!-- 备注 -->
          <el-tag type="warning" v-if="f.desc">注：{{ f.desc }}</el-tag>
          <div class="text-radar-sound" v-if="f.type == 'textRadar'">
            <audio :src="assetsDomain + contents[activeFormIndex]['sound']" controls></audio>
          </div>
        </el-form-item>
        <el-form-item
          label-width="140px"
          label="词性"
          v-if="f.feild == 'pos'">
          <el-select
            v-if="f.data_from == 'part_of_speech'"
            v-model="contents[activeFormIndex]['' + f.feild + '']"
            placeholder="请选择">
            <el-option
              v-for="(item, index) in partOfSpeech"
              :key="item.key + index"
              :label="item.name + '( '+ item.key +' )'"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label-width="140px"
          label="题型"
          v-if="f.data_from == 'content_types'"
          :prop="f.feild"
          :rules="[
            { required: true, message: '请选择题型', trigger: 'change' }
          ]">
          <el-select
            v-model="contents[activeFormIndex]['' + f.feild + '']"
            placeholder="请选择题型">
            <el-option
              v-for="item in selfContentTypes"
              :key="item.type"
              :label="item.name"
              :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="140px" :label="f.name" v-if="(f.type == 'templateArray' && contents[activeFormIndex]['' + f.feild + ''] && contents[activeFormIndex]['' + f.feild + ''].length)">
          <div class="template-options">
            <el-tag
              v-for="(item, index) in contents[activeFormIndex]['' + f.feild + '']"
              :key="'templateArray' + index"
              type="info"
              effect="plain">
              {{ item }}
            </el-tag>
          </div>
        </el-form-item>
      </div>
      <el-form-item class="btn-handler">
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
    <right-menu-form
      ref="rightMenuForm"
      @paste="paste"
    />
  </div>
</template>

<script>
import FormComp from './form'
import FormVideo from './formVideo'
import FormKidTest from './kidTest/kidTest'
import FormLevelGrade from './levelGrade/levelGrade'
import FormListenSpelling from './listenSpelling/listenSpelling'
import FormIntertranslation from './intertranslation/intertranslation'
import FormWritingTraining from './writingTraining/writingTraining'
import FormVocabularyComprehension from './vocabularyComprehension/vocabularyComprehension'
import FormReadingComprehension from './readingComprehension/readingComprehension'
import FormReadRole from './readRole/readRole'
import FormListeningChoice from './listeningChoice/listeningChoice'
import FormDubbingRepeat from './dubbingRepeat/dubbingRepeat'
import FormRubbingEar from './rubbingEar/rubbingEar'
import FormListenRead from './listenRead/listenRead'
import LookImage from './lookImage'
import LookContent from './lookContent'
import RightMenuForm from './rightMenuForm'

import { mapState } from 'vuex'
import {
  editContent,
  delContent,
  getInfoToken,
  addMoreImages
  // ,
  // getContent
} from '@/api/course'
import {
  uploadQiniu
} from '@/utils/uploadQiniu'
import Sortable from 'sortablejs'
import moment from 'moment'

export default {
  data () {
    return {
      formHeight: 0,
      pathDesc: '',
      pUUID: '',
      isShow: false,
      contents: [],
      feilds: [],
      contentModel: '',
      form: {},
      activeFormIndex: 0,
      activeFeild: '',
      baseFormDataSelf: '',
      copyBaseFormDataSelf: '',
      uploadIndex: '',
      audio: new Audio()
    }
  },
  components: {
    FormComp,
    FormVideo,
    FormKidTest,
    FormLevelGrade,
    FormListenSpelling,
    FormIntertranslation,
    FormWritingTraining,
    FormVocabularyComprehension,
    FormReadingComprehension,
    FormReadRole,
    FormListeningChoice,
    FormDubbingRepeat,
    FormRubbingEar,
    FormListenRead,
    LookImage,
    LookContent,
    RightMenuForm
  },
  mounted () {
    let formsEl = document.getElementById('forms')
    formsEl.oncontextmenu = (e) => {
      e.preventDefault()
    }
    formsEl.onclick = () => {
      if (this.$refs['rightMenuForm']) {
        this.$refs['rightMenuForm'].hide()
      }
    }
  },
  computed: {
    ...mapState({
      contentTypes: state => state.course.contentTypes,
      contentTags: state => state.course.contentTags,
      assetsDomain: state => state.course.assetsDomain,
      selfSigns: state => state.course.selfSigns,
      version: state => state.course.version,
      partOfSpeech: state => state.course.partOfSpeech,
      lowerRoleUser: state => state.user.lowerRoleUser
    }),
    selfContentTypes () {
      // return this.contentTypes.filter(item => {
      //   return item.model_key === this.contentModel
      // })
      return this.contentTypes.filter(item => {
        return item.model_keys && item.model_keys.findIndex(m => { return m === this.contentModel }) > -1
      })
    },
    selfContentTags () {
      let arr = []
      if (this.version && this.contentTags.length) {
        let courseType = this.version.selCourseType
        let type = 'pro'
        if (courseType === 3) {
          type = 'kid'
        }
        arr = this.contentTags.filter(item => {
          return item.type.toLowerCase() === type
        })
      }
      return arr
    }
  },
  methods: {
    initData (params) {
      console.log(params)
      getInfoToken().then(res => {
        this.token = res.data.token
      })
      this.activeFormIndex = 0
      this.pathDesc = params.pathDesc
      this.$set(this.$data, 'pUUID', params.pUUID)
      this.$set(this.$data, 'contents', params.contents)
      this.baseFormDataSelf = params.baseFormData
      this.copyBaseFormDataSelf = params.baseFormData
      this.$set(this.$data, 'feilds', params.feilds.sort((a, b) => { return a.list_order - b.list_order }))
      this.$set(this.$data, 'contentModel', params.contentModel)
      this.$bus.$emit('curContentForm', params.contents[this.activeFormIndex])
      this.formHeight = 220
      if (this.version.selCourseType === 0) {
        this.formHeight = 385
      }
      this.resetSortable()
      this.isShow = true
    },
    resetSortable () {
      /* eslint-disable */
      let el = document.getElementById('sort-form')
      let sortable = new Sortable(el, {
        animation: 150,
        onEnd: (evt) => {
          let newContents = []
          let copyContents = this.contents
          let indexArr = sortable.toArray()
          console.log(indexArr)
          indexArr.forEach((item, index) => {
            let obj = copyContents[parseInt(item)]
            obj['list_order'] = (index + 1) * 10
            newContents.push(obj)
          })
          this.contents = []
          setTimeout(() => {
            this.$set(this, 'contents', newContents)
            this.activeFormIndex = evt.newIndex
            let obj = {
              content_model: this.contentModel,
              contents: this.contents,
              parent_uuid: this.pUUID
            }
            console.log(obj)
            editContent(obj).then(() => {
              // getContent({ 'content_model': this.contentModel, 'parent_uuid': this.pUUID }).then(res => {
              //   this.$set(this, 'contents', res.data.contents.sort((a, b) => {
              //     return a.list_order - b.list_order
              //   }))
              // })
            })
          }, 0)
        }
      })
      /* eslint-enable */
    },
    resetData () {
      this.pUUID = ''
      this.contents = []
      this.feilds = []
      this.contentModel = ''
      this.form = {}
      this.activeFormIndex = 0
      this.activeFeild = ''
      this.isShow = false
    },
    switchForm (params) {
      this.activeFormIndex = params.formIndex
      this.$set(this.contents, this.activeFormIndex, params.content)
      this.$bus.$emit('curContentForm', this.contents[this.activeFormIndex])
    },
    async onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let arr = []
          this.contents.forEach((item, index) => {
            let obj = item
            obj['list_order'] = (index + 1) * 10
            arr.push(obj)
          })

          let msg = ''
          for (let i = 0; i < this.contents.length; i++) {
            let item = this.contents[i]
            // 判断声音拓展名
            let sound = item['sound']
            if (sound) {
              let ext = sound.substring(sound.lastIndexOf('.') + 1)
              if (ext.toLowerCase() !== 'mp3') {
                msg = '上传的声音文件地址格式不对，需要上传mp3格式的声音'
                break
              }
            }
            let image = item['image']
            if (image) {
              let ext = image.substring(image.lastIndexOf('.') + 1)
              if (ext.toLowerCase() !== 'webp') {
                msg = '上传的图片文件地址格式不对，需要上传webp格式的图片'
                break
              }
            }
            let video = item['video']
            if (video) {
              let ext = video.substring(video.lastIndexOf('.') + 1)
              if (ext.toLowerCase() !== 'mp4') {
                msg = '上传的视频文件地址格式不对，需要上传MP4格式的视频'
                break
              }
            }
          }
          if (msg) {
            this.$message({
              type: 'warning',
              message: msg
            })
            return false
          }
          this.$set(this.$data, 'contents', arr)
          let obj = {
            content_model: this.contentModel,
            contents: this.contents,
            parent_uuid: this.pUUID
          }
          editContent(obj).then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.$set(this.$data, 'contents', res.data.contents)
            }
          })
        }
      })
    },
    addForm () {
      this.copyBaseFormDataSelf = this.baseFormDataSelf
      let obj = JSON.parse(this.baseFormDataSelf)
      this.contents.push(obj)
      this.activeFormIndex = this.contents.length - 1
      this.resetSortable()
    },
    delForm (params) {
      if (params.form.uuid) {
        console.log(params)
        this.$confirm('确认要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            content_model: this.contentModel,
            parent_uuid: this.pUUID,
            del_uuids: [
              params.form.uuid
            ]
          }
          delContent(obj).then(res => {
            if (res.success) {
              this.activeFormIndex = 0
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              if (this.contents.length > 1) {
                let delIndex = this.contents.findIndex(item => {
                  return item.uuid === params.form.uuid
                })
                this.contents.splice(delIndex, 1)
              } else {
                let obj = JSON.parse(this.baseFormDataSelf)
                this.contents.splice(0, 1, obj)
              }
              // let delIndex = this.contents.findIndex(item => {
              //   return item.uuid === params.form.uuid
              // })
              // this.contents.splice(delIndex, 1)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        if (this.contents.length === 1 && params.form.uuid === '') {
          this.$message({
            type: 'warning',
            message: '没有可删除的内容!'
          })
          return false
        }
        this.activeFormIndex = 0
        this.contents.splice(params.formIndex, 1)
      }
    },
    // 内容查找
    searchContent (feild) {
      this.activeFeild = feild
      console.log(this.activeFeild)
    },
    // 图库查找
    searchImg (feild) {
      this.activeFeild = feild
    },
    // 使用图片（声音）
    use (params) {
      let url = ''
      if (params.flag) {
        url = params.url
      }
      this.$set(this.contents[this.activeFormIndex], params.type, url)
    },
    // 使用图片
    useImg (img) {
      console.log('modelProImg', img)
      console.log('this.curForm', this.curForm)
      this.curForm.image = img
    },
    // 预览
    lookPreview () {
      let obj = {
        contents: this.contents,
        contentModel: this.contentModel
      }
      // this.$refs.preview.show(obj)
      this.$bus.emit('showPreviewModel', obj)
    },
    // 取消图库查找
    closeLook () {
      this.activeFeild = ''
    },
    // 清除图片（声音）地址
    clear (type) {
      this.$set(this.contents[this.activeFormIndex], type, '')
    },
    // 添加一个选项
    addOption (f) {
      console.log(f)
      if (!this.contents[this.activeFormIndex]['' + f.feild + '']) {
        this.contents[this.activeFormIndex]['' + f.feild + ''] = []
      }
      this.contents[this.activeFormIndex]['' + f.feild + ''].push('')
    },
    // 删除一个选项
    delOption (f, index) {
      this.contents[this.activeFormIndex]['' + f.feild + ''].splice(index, 1)
    },
    // form区域右键菜单
    contentmenu (ev) {
      // if (this.lowerRoleUser) {
      //   return false
      // }
      this.$refs['rightMenuForm'].show(ev)
    },
    paste () {
      let obj = JSON.parse(this.version.copyForm)
      obj['uuid'] = ''
      this.contents.push(obj)
      this.activeFormIndex = this.contents.length - 1
      this.resetSortable()
      this.$refs['rightMenuForm'].hide()
    },
    // 上传声音
    async uploadSoundOnchange (file) {
      console.log(file)
      let date = moment(new Date()).format('YYYY/MM/DD')
      let i = file.name.lastIndexOf('.')
      let ext = file.name.substring(i + 1)
      let url = 'course/sounds/' + this.version.selLang.toLowerCase() + '/' + date + '/' + file.uid + '.' + ext
      console.log(url)
      let res = await uploadQiniu(file.raw, this.token, url)
      this.$set(this.contents[this.activeFormIndex], 'sound', res.key)
      // 计算声音时长
      if (typeof this.contents[this.activeFormIndex]['sound_time'] !== 'undefined') {
        let mySound = new Audio()
        mySound.src = this.assetsDomain + res.key
        mySound.oncanplay = () => {
          this.$set(this.contents[this.activeFormIndex], 'sound_time', mySound.duration)
        }
      }
    },
    // 保存录音
    async saveRecorder (mp3BlobData) {
      console.log(mp3BlobData)
      let date = moment(new Date()).format('YYYY/MM/DD')
      let ext = 'mp3'
      let url = 'course/sounds/' + this.version.selLang.toLowerCase() + '/' + date + '/' + (new Date()).getTime() + '.' + ext
      console.log(url)
      let res = await uploadQiniu(mp3BlobData, this.token, url)
      this.$set(this.contents[this.activeFormIndex], 'sound', res.key)
      // 计算声音时长
      if (typeof this.contents[this.activeFormIndex]['sound_time'] !== 'undefined') {
        let mySound = new Audio()
        mySound.src = this.assetsDomain + res.key
        mySound.oncanplay = () => {
          this.$set(this.contents[this.activeFormIndex], 'sound_time', mySound.duration)
        }
      }
    },
    // 上传图片
    async uploadImageOnchange (file) {
      console.log(file)
      let date = moment(new Date()).format('YYYY/MM/DD')
      let i = file.name.lastIndexOf('.')
      let ext = file.name.substring(i + 1)
      let name = file.name.substring(0, i)
      let url = 'course/images/common/' + this.version.selLang.toLowerCase() + '/' + date + '/' + file.uid + '.' + ext
      console.log(url)
      this.saveImages([url], [name])
      let res = await uploadQiniu(file.raw, this.token, url)
      this.$set(this.contents[this.activeFormIndex], 'image', res.key)
    },
    // 上传视频
    async uploadVideoOnchange (file) {
      console.log(file)
      let date = moment(new Date()).format('YYYY/MM/DD')
      let i = file.name.lastIndexOf('.')
      let ext = file.name.substring(i + 1)
      let url = 'course/videos/' + this.version.selLang.toLowerCase() + '/' + date + '/' + file.uid + '.' + ext
      console.log(url)
      let res = await uploadQiniu(file.raw, this.token, url)
      this.$set(this.contents[this.activeFormIndex], 'video', res.key)
      let myVideo = document.getElementById('form-video-' + this.activeFormIndex)
      setTimeout(() => {
        myVideo.oncanplay = () => {
          this.$set(this.contents[this.activeFormIndex], 'video_time', myVideo.duration)
        }
      }, 0)
    },
    // 上传封面
    async uploadCoverOnchange (file) {
      console.log(file)
      let date = moment(new Date()).format('YYYY/MM/DD')
      let i = file.name.lastIndexOf('.')
      let ext = file.name.substring(i + 1)
      let name = file.name.substring(0, i)
      let url = 'course/images/' + this.version.selLang.toLowerCase() + '/' + date + '/' + file.uid + '.' + ext
      console.log(url)
      this.saveImages([url], [name])
      let res = await uploadQiniu(file.raw, this.token, url)
      this.$set(this.contents[this.activeFormIndex], 'cover', res.key)
    },
    // 减少输入框
    minus (index, feild) {
      this.contents[this.activeFormIndex]['' + feild + ''].splice(index, 1)
      this.copyBaseFormDataSelf = JSON.stringify(this.contents[this.activeFormIndex])
    },
    // 增加输入框
    plus (flag, f) {
      let feild = f.feild
      this.copyBaseFormDataSelf = JSON.stringify(this.contents[this.activeFormIndex])
      let obj = JSON.parse(this.copyBaseFormDataSelf)
      if (!obj['' + feild + '']) {
        obj['' + feild + ''] = []
      }
      if (flag === 'string') {
        obj['' + feild + ''].push('')
      } else {
        if (f.sub_feilds && f.sub_feilds.length > 0) {
          let o = {}
          f.sub_feilds.forEach(sf => {
            let k = sf.feild
            let v = ''
            if (sf.type === 'string' || sf.type === 'text') {
              v = ''
            } else if (sf.type === 'int') {
              v = 0
            } else if (sf.type === 'array') {
              v = ['']
            }
            o['' + k + ''] = v
          })
          obj['' + feild + ''].push(o)
        } else {
          obj['' + feild + ''].push({ key: '', val: '' })
        }
      }
      this.$set(this.contents, this.activeFormIndex, obj)
      this.copyBaseFormDataSelf = JSON.stringify(obj)
    },
    upload (f, index) {
      this.uploadIndex = f.data_from + ',' + f.feild + ',' + index
      console.log(this.uploadIndex)
    },
    async uploadOnchange (file) {
      let uploadIndexArr = this.uploadIndex.split(',')
      let dataFrom = uploadIndexArr[0]
      let feild = uploadIndexArr[1]
      let index = uploadIndexArr[2]
      let date = moment(new Date()).format('YYYY/MM/DD')
      let i = file.name.lastIndexOf('.')
      let ext = file.name.substring(i + 1)
      let name = file.name.substring(0, i)
      let url = ''
      if (dataFrom === 'upload_audio') {
        url = 'course/sounds/' + this.version.selLang + '/' + date + '/' + file.uid + '.' + ext
      } else if (dataFrom === 'upload_image') {
        url = 'course/images/' + this.version.selLang + '/' + date + '/' + file.uid + '.' + ext
        this.saveImages([url], [name])
      } else if (dataFrom === 'upload_video') {
        url = 'course/videos/' + this.version.selLang + '/' + date + '/' + file.uid + '.' + ext
      }
      let res = await uploadQiniu(file.raw, this.token, url)
      if (index === '-1') {
        this.$set(this.contents[this.activeFormIndex], feild, res.key)
        this.copyBaseFormDataSelf = JSON.stringify(this.contents[this.activeFormIndex])
        // 计算声音时长
        if (typeof this.contents[this.activeFormIndex][feild + '_time'] !== 'undefined') {
          let mySound = new Audio()
          mySound.src = this.assetsDomain + res.key
          mySound.oncanplay = () => {
            this.$set(this.contents[this.activeFormIndex], feild + '_time', mySound.duration)
            this.copyBaseFormDataSelf = JSON.stringify(this.contents[this.activeFormIndex])
          }
        }
      } else {
        this.$set(this.contents[this.activeFormIndex][feild], index, res.key)
        this.copyBaseFormDataSelf = JSON.stringify(this.contents[this.activeFormIndex])
        // 计算声音时长
        if (typeof this.contents[this.activeFormIndex][feild + '_time'] !== 'undefined' && typeof this.contents[this.activeFormIndex][feild + '_time'].length > 0) {
          let mySound = new Audio()
          mySound.src = this.assetsDomain + res.key
          mySound.oncanplay = () => {
            this.$set(this.contents[this.activeFormIndex][feild + '_time'], index, mySound.duration)
            this.copyBaseFormDataSelf = JSON.stringify(this.contents[this.activeFormIndex])
          }
        }
      }
    },
    uploadSub (f, index, subIndex, sf) {
      this.uploadIndex = sf.data_from + ',' + f.feild + ',' + index + ',' + subIndex + ',' + sf.feild
      console.log(this.uploadIndex)
    },
    async uploadOnchangeSub (file) {
      let uploadIndexArr = this.uploadIndex.split(',')
      let dataFrom = uploadIndexArr[0]
      let feild = uploadIndexArr[1]
      let index = uploadIndexArr[2]
      let subIndex = parseInt(uploadIndexArr[3])
      let subFeild = uploadIndexArr[4]
      let date = moment(new Date()).format('YYYY/MM/DD')
      let i = file.name.lastIndexOf('.')
      let ext = file.name.substring(i + 1)
      let name = file.name.substring(0, i)
      let url = ''
      if (dataFrom === 'upload_audio') {
        url = 'course/sounds/' + this.version.selLang + '/' + date + '/' + file.uid + '.' + ext
      } else if (dataFrom === 'upload_image') {
        url = 'course/images/' + this.version.selLang + '/' + date + '/' + file.uid + '.' + ext
        this.saveImages([url], [name])
      } else if (dataFrom === 'upload_video') {
        url = 'course/videos/' + this.version.selLang + '/' + date + '/' + file.uid + '.' + ext
      }
      let res = await uploadQiniu(file.raw, this.token, url)
      if (index === '-1') {
        this.$set(this.contents[this.activeFormIndex]['' + feild + ''][subIndex], subFeild, res.key)
        this.copyBaseFormDataSelf = JSON.stringify(this.contents[this.activeFormIndex])
        // 计算声音时长
        if (typeof this.contents[this.activeFormIndex]['' + feild + ''][subIndex][feild + '_time'] !== 'undefined') {
          let mySound = new Audio()
          mySound.src = this.assetsDomain + res.key
          mySound.oncanplay = () => {
            this.$set(this.contents[this.activeFormIndex]['' + feild + ''][subIndex], feild + '_time', mySound.duration)
            this.copyBaseFormDataSelf = JSON.stringify(this.contents[this.activeFormIndex])
          }
        }
      } else {
        this.$set(this.contents[this.activeFormIndex][feild][index]['' + subFeild + ''], subIndex, res.key)
        this.copyBaseFormDataSelf = JSON.stringify(this.contents[this.activeFormIndex])
        // 计算声音时长
        if (typeof this.contents[this.activeFormIndex][feild][index][feild + '_time'] !== 'undefined' && typeof this.contents[this.activeFormIndex][feild][index][feild + '_time'].length > 0) {
          let mySound = new Audio()
          mySound.src = this.assetsDomain + res.key
          mySound.oncanplay = () => {
            this.$set(this.contents[this.activeFormIndex][feild][index][feild + '_time'], subIndex, mySound.duration)
            this.copyBaseFormDataSelf = JSON.stringify(this.contents[this.activeFormIndex])
          }
        }
      }
    },
    selOneSign (sign) {
      this.contents[this.activeFormIndex]['self_sign'] = sign.key
    },
    toggleRecorder () {
      this.$refs['recorder'][0].toggle()
    },
    motherSoundPlay (url) {
      this.audio.src = this.assetsDomain + url
      this.audio.oncanplay = () => {
        this.audio.play()
      }
    },
    changeStringOptions (feild) {
      let text = this.contents[this.activeFormIndex]['' + feild + '']
      if (text) {
        this.contents[this.activeFormIndex]['options'] = text.split('')
      }
    },
    changeTextOptions (feild) {
      console.log(this.contents[this.activeFormIndex]['' + feild + ''])
      let text = this.contents[this.activeFormIndex]['' + feild + '']
      if (text) {
        let re = /\[(.*?)\]/g
        let array = []
        let temp = re.exec(text)
        while (temp) {
          array.push(temp[1])
          temp = re.exec(text)
        }
        this.contents[this.activeFormIndex]['options'] = array
      }
    },
    changeTextRadar (feild) {
      console.log(this.contents[this.activeFormIndex]['' + feild + ''])
      let text = this.contents[this.activeFormIndex]['' + feild + '']
      if (text) {
        let radar = []
        let array = text.split('/')
        array.forEach(i => {
          radar.push({
            key: i,
            val: ''
          })
        })
        this.contents[this.activeFormIndex]['radar'] = radar
      }
    },
    addSubItem (f, sf, i) {
      this.contents[this.activeFormIndex]['' + f.feild + ''][i]['' + sf.feild + ''].push('')
    },
    minusSubItem (f, sf, i, oi) {
      this.contents[this.activeFormIndex]['' + f.feild + ''][i]['' + sf.feild + ''].splice(oi, 1)
    },
    // 对于上传的图片，存储到图片库“通用”分类下
    saveImages (imageUrls, names) {
      let obj = {
        image_urls: imageUrls,
        tagKeys: ['通用'],
        names: names
      }
      addMoreImages(obj)
    },
    async download (url) {
      if (!url) {
        return
      }
      let name = url.slice(url.lastIndexOf('/') + 1)
      let response = await fetch(this.assetsDomain + url)
      // 内容转变成blob地址
      let blob = await response.blob()
      // 创建隐藏的可下载链接
      let objectUrl = window.URL.createObjectURL(blob)
      let a = document.createElement('a')
      // 地址
      a.href = objectUrl
      // 修改文件名
      a.download = name
      // 触发点击
      document.body.appendChild(a)
      a.click()
      // 移除
      setTimeout(() => {
        document.body.removeChild(a)
      }, 1000)
      console.log(response)
    }
  }
}
</script>

<style lang="scss" scoped>
.model-pro-container {
  overflow: auto;
}
.top-bar {
  padding-right: 20px;
  height: 40px;
  background: #fff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .left {
    padding-left: 20px;
  }
  .right {
    min-width: 70px;
    margin-left: 20px;
  }
}
.forms {
  background: #E5E6E5;
  flex: 1;
  padding: 30px;
  // width: 400px;
  // overflow-x: auto;
  .list {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
.el-form {
  position: relative;
  padding: 20px 40px 20px 20px;
  .el-select {
    width: 50%;
  }
}
.form-image {
  .el-image {
    margin-top: 15px;
    border-radius: 4px;
    margin-right: 10px;
  }
}
.options {
  display: flex;
  flex-direction: row;
  .option-list {
    display: flex;
    flex-direction: row;
    .option-item {
      margin-right: 10px;
      position: relative;
      input {
        padding: 3px;
        text-align: center;
        width: 100px;
        border: 0;
        border-bottom: 1px solid #DCDFE6;
      }
      i {
        position: absolute;
        top: 6px;
        right: 0;
        cursor: pointer;
      }
    }
  }
  .add-option {
    width: 30px;
    height: 30px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-left: 20px;
    margin-right: 20px;
    cursor: pointer;
    i {
      color: #DCDFE6;
      font-size: 20px;
    }
  }
}

.template-options {
  .el-tag {
    margin-right: 10px;
  }
}

.btn-handler {
  text-align: center;
}

.upload-area {
  display: flex;
  flex-direction: row;
  .el-button {
    margin-right: 20px;
  }
}

.array-string {
  .el-input {
    margin: 5px 0;
  }
}

.array-object {
  .object-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
    padding-top: 5px;
    .num {
      padding: 0 10px;
    }
    .left {
      width: 70%;
      border-left: 1px solid rgba(0, 0, 0, .1);
      border-right: 1px solid rgba(0, 0, 0, .1);
      padding:0 10px;
      .row {
        display: flex;
        flex-direction: row;
        .text {
          font-size: 12px;
        }
        .text-input {
          flex-grow: 1;
        }
      }
    }
    .right {
      padding-left: 20px;
    }
    .el-input {
      width: 100%;
      margin: 0 20px 0 0;
    }
  }
}

.self-sign {
  .el-tag {
    margin: 0 10px;
  }
}

.text-radar-sound {
  margin-top: 20px;
  audio {
    width: 100%;
  }
}

.sub-item {
  .el-form-item {
    margin: 5px;
  }
}

.sub-item-option {
  display: flex;
  flex-direction: row;
  margin-bottom: 2px;
  .sub-item-input {
    width: 80%;
    margin-right: 10px;
  }
}

.icon-input {
  display: inline-block;
  width: 24px;
  height:24px;
  background-repeat: no-repeat;
  background-size: cover;
}

.icon-sound {
  background-image: url('../../../assets/images/icons/icon-sound.png');
}

.icon-video {
  background-image: url('../../../assets/images/icons/icon-video.png');
}

.icon-picture {
  background-image: url('../../../assets/images/icons/icon-picture.png');
}
</style>

<style>
.el-checkbox__label {
  white-space: break-spaces;
}

.el-icon-download {
  cursor: pointer;
}
</style>
