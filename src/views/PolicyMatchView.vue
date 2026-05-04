<template>
  <div class="policy-match-container">
    <el-header>
      <div class="header-content">
        <el-button type="primary" @click="goBack">
          <el-icon><i-ep-arrow-left /></el-icon>
          返回
        </el-button>
        <h1>惠农政策匹配</h1>
      </div>
    </el-header>
    <el-main>
      <div class="questionnaire-container">
        <el-steps :active="currentStep" finish-status="success">
          <el-step title="身份类型" />
          <el-step title="种植/养殖品类" />
          <el-step title="面积/规模" />
          <el-step title="所在地区" />
          <el-step title="困难身份" />
        </el-steps>

        <div class="step-hint">
        {{  currentStep === 0 ? '📝 请选择您的身份' : 
            currentStep === 1 ? '🌾 请选择您的种植/养殖品类' :
            currentStep === 2 ? '📏 请选择您的面积/规模' :
            currentStep === 3 ? '📍 请选择您所在的地区' :
            currentStep === 4 ? '❤️ 请选择是否有困难身份' : '' }}
        </div>        
        
        <div class="question-content">
          <!-- 第一步：身份类型 -->
          <div v-if="currentStep === 0">
            <h2>请选择您的身份类型</h2>
            <el-radio-group v-model="form.identity">
              <el-radio label="种植户">种植户</el-radio>
              <el-radio label="养殖户">养殖户</el-radio>
              <el-radio label="普通农户">普通农户</el-radio>
              <el-radio label="脱贫户">脱贫户</el-radio>
              <el-radio label="返乡创业人员">返乡创业人员</el-radio>
            </el-radio-group>
          </div>
          
          <!-- 第二步：种植/养殖品类 -->
          <div v-if="currentStep === 1">
            <h2>请选择您的种植/养殖品类</h2>
            <el-checkbox-group v-model="form.categories">
              <el-checkbox label="水稻">水稻</el-checkbox>
              <el-checkbox label="玉米">玉米</el-checkbox>
              <el-checkbox label="茶叶">茶叶</el-checkbox>
              <el-checkbox label="生猪">生猪</el-checkbox>
              <el-checkbox label="牛羊">牛羊</el-checkbox>
            </el-checkbox-group>
          </div>
          
          <!-- 第三步：面积/规模 -->
          <div v-if="currentStep === 2">
            <h2>请选择您的面积/规模</h2>
            <el-radio-group v-model="form.scale">
              <el-radio label="0-1亩">0-1亩</el-radio>
              <el-radio label="1-5亩">1-5亩</el-radio>
              <el-radio label="5亩以上">5亩以上</el-radio>
              <el-radio label="小规模养殖">小规模养殖</el-radio>
            </el-radio-group>
          </div>
          
          <!-- 第四步：所在地区 -->
          <div v-if="currentStep === 3">
            <h2>请选择您的所在地区</h2>
            <el-row :gutter="15">
              <el-col :span="12">
                <el-select v-model="form.province" placeholder="请选择省份" style="width:100%">
                  <el-option v-for="p in provinces" :key="p" :label="p" :value="p" />
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-select v-model="form.city" placeholder="请选择城市" style="width:100%" :disabled="!form.province">
                  <el-option v-for="c in cityOptions" :key="c" :label="c" :value="c" />
                </el-select>
              </el-col>
            </el-row>
            <el-form-item style="margin-top:15px">
              <el-input v-model="form.areaDetail" placeholder="请输入详细地址（县/镇/村）" />
            </el-form-item>
          </div>
          
          <!-- 第五步：困难身份 -->
          <div v-if="currentStep === 4">
            <h2>是否有困难身份？</h2>
            <el-radio-group v-model="form.isDifficult">
              <el-radio label="是">是</el-radio>
              <el-radio label="否">否</el-radio>
            </el-radio-group>
          </div>
        </div>
        
        <div class="selected-preview" v-if="hasSelectedInfo">
          <div class="preview-title">📋 已选信息</div>
          <div class="preview-tags">
            <span v-if="form.identity" class="preview-tag">👤 {{ form.identity }}</span>
            <span v-for="cat in form.categories" :key="cat" class="preview-tag">🌾 {{ cat }}</span>
            <span v-if="form.scale" class="preview-tag">📏 {{ form.scale }}</span>
            <span v-if="form.isDifficult === '是'" class="preview-tag">❤️ 困难身份</span>
          </div>
        </div>

         <!-- AI辅助生成：DeepSeek网页版, 2026-4-19 -->
                <!-- 匹配率进度条 -->
        <div class="match-progress">
          <div class="progress-header">
            <span class="progress-label">📊 匹配完成度</span>
            <span class="progress-value">{{ matchProgress }}%</span>
          </div>
          <el-progress :percentage="matchProgress" :color="'#2e7d32'" :stroke-width="8" :show-text="false" />
          <div class="progress-tip">{{ progressTip }}</div>
        </div>

        <!-- 政策小贴士 -->
        <div class="policy-tips">
          <div class="tips-icon">💡</div>
          <div class="tips-text">
            <el-carousel :interval="4000" height="40px" direction="vertical" :loop="true" :autoplay="true">
              <el-carousel-item>🌾 种植水稻、玉米可申请粮食补贴，每亩100-200元</el-carousel-item>
              <el-carousel-item>🚜 购买指定农机具最高可补贴30%，单台最高5万元</el-carousel-item>
              <el-carousel-item>📚 脱贫户子女教育每年补助1000-3000元</el-carousel-item>
              <el-carousel-item>🏠 返乡创业可申请5000-20000元创业补贴</el-carousel-item>
              <el-carousel-item>🐷 规模化养殖生猪，每头可补贴50-100元</el-carousel-item>
            </el-carousel>
          </div>
        </div>

        <div class="button-group">
          <el-button v-if="currentStep > 0" @click="prevStep">上一步</el-button>
          <el-button v-if="currentStep < 4" type="primary" @click="nextStep">下一步</el-button>
          <el-button v-if="currentStep === 4" type="success" @click="submitForm">一键查询补贴</el-button>
        </div>
      </div>
      
      <!-- 结果弹窗 -->
      <el-dialog v-model="resultVisible" title="匹配结果" width="80%">
        <div class="result-container">
          <h3>符合条件的补贴政策</h3>
          <el-card v-for="policy in matchedPolicies" :key="policy.id" class="policy-card">
            <h4>{{ policy.name }}</h4>
            <p><strong>金额范围：</strong>{{ policy.amount }}</p>
            <p><strong>适用条件：</strong>{{ policy.condition }}</p>
            <p><strong>申请材料：</strong></p>
            <ul>
              <li v-for="(material, index) in policy.materials" :key="index">{{ material }}</li>
            </ul>
            <p><strong>咨询电话：</strong>{{ policy.phone }}</p>
          </el-card>
        </div>
        <template #footer>
          <el-button @click="resultVisible = false">关闭</el-button>
        </template>
      </el-dialog>
    </el-main>
  </div>
</template>

<script setup>
// 省份列表
const provinces = [
  '北京市', '天津市', '河北省', '山西省', '内蒙古自治区',
  '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省',
  '浙江省', '安徽省', '福建省', '江西省', '山东省',
  '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区',
  '海南省', '重庆市', '四川省', '贵州省', '云南省',
  '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区',
  '新疆维吾尔自治区', '香港特别行政区', '澳门特别行政区', '台湾省'
]

// 城市映射（省份 -> 城市列表）
const cityMap = {
  '北京市': ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '石景山区', '通州区', '顺义区', '昌平区', '大兴区', '房山区', '门头沟区', '怀柔区', '平谷区', '密云区', '延庆区'],
  '天津市': ['和平区', '河东区', '河西区', '南开区', '河北区', '红桥区', '东丽区', '西青区', '津南区', '北辰区', '武清区', '宝坻区', '滨海新区', '宁河区', '静海区', '蓟州区'],
  '河北省': ['石家庄市', '唐山市', '秦皇岛市', '邯郸市', '邢台市', '保定市', '张家口市', '承德市', '沧州市', '廊坊市', '衡水市', '雄安新区'],
  '山西省': ['太原市', '大同市', '阳泉市', '长治市', '晋城市', '朔州市', '晋中市', '运城市', '忻州市', '临汾市', '吕梁市'],
  '内蒙古自治区': ['呼和浩特市', '包头市', '乌海市', '赤峰市', '通辽市', '鄂尔多斯市', '呼伦贝尔市', '巴彦淖尔市', '乌兰察布市', '兴安盟', '锡林郭勒盟', '阿拉善盟'],
  '辽宁省': ['沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市', '丹东市', '锦州市', '营口市', '阜新市', '辽阳市', '盘锦市', '铁岭市', '朝阳市', '葫芦岛市'],
  '吉林省': ['长春市', '吉林市', '四平市', '辽源市', '通化市', '白山市', '松原市', '白城市', '延边朝鲜族自治州'],
  '黑龙江省': ['哈尔滨市', '齐齐哈尔市', '鸡西市', '鹤岗市', '双鸭山市', '大庆市', '伊春市', '佳木斯市', '七台河市', '牡丹江市', '黑河市', '绥化市', '大兴安岭地区'],
  '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区'],
  '江苏省': ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市'],
  '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市'],
  '安徽省': ['合肥市', '芜湖市', '蚌埠市', '淮南市', '马鞍山市', '淮北市', '铜陵市', '安庆市', '黄山市', '滁州市', '阜阳市', '宿州市', '六安市', '亳州市', '池州市', '宣城市'],
  '福建省': ['福州市', '厦门市', '莆田市', '三明市', '泉州市', '漳州市', '南平市', '龙岩市', '宁德市'],
  '江西省': ['南昌市', '景德镇市', '萍乡市', '九江市', '新余市', '鹰潭市', '赣州市', '吉安市', '宜春市', '抚州市', '上饶市'],
  '山东省': ['济南市', '青岛市', '淄博市', '枣庄市', '东营市', '烟台市', '潍坊市', '济宁市', '泰安市', '威海市', '日照市', '临沂市', '德州市', '聊城市', '滨州市', '菏泽市'],
  '河南省': ['郑州市', '开封市', '洛阳市', '平顶山市', '安阳市', '鹤壁市', '新乡市', '焦作市', '濮阳市', '许昌市', '漯河市', '三门峡市', '南阳市', '商丘市', '信阳市', '周口市', '驻马店市', '济源市'],
  '湖北省': ['武汉市', '黄石市', '十堰市', '宜昌市', '襄阳市', '鄂州市', '荆门市', '孝感市', '荆州市', '黄冈市', '咸宁市', '随州市', '恩施土家族苗族自治州', '仙桃市', '潜江市', '天门市', '神农架林区'],
  '湖南省': ['长沙市', '株洲市', '湘潭市', '衡阳市', '邵阳市', '岳阳市', '常德市', '张家界市', '益阳市', '郴州市', '永州市', '怀化市', '娄底市', '湘西土家族苗族自治州'],
  '广东省': ['广州市', '韶关市', '深圳市', '珠海市', '汕头市', '佛山市', '江门市', '湛江市', '茂名市', '肇庆市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '东莞市', '中山市', '潮州市', '揭阳市', '云浮市'],
  '广西壮族自治区': ['南宁市', '柳州市', '桂林市', '梧州市', '北海市', '防城港市', '钦州市', '贵港市', '玉林市', '百色市', '贺州市', '河池市', '来宾市', '崇左市'],
  '海南省': ['海口市', '三亚市', '三沙市', '儋州市', '五指山市', '琼海市', '文昌市', '万宁市', '东方市', '定安县', '屯昌县', '澄迈县', '临高县', '白沙黎族自治县', '昌江黎族自治县', '乐东黎族自治县', '陵水黎族自治县', '保亭黎族苗族自治县', '琼中黎族苗族自治县'],
  '重庆市': ['万州区', '涪陵区', '渝中区', '大渡口区', '江北区', '沙坪坝区', '九龙坡区', '南岸区', '北碚区', '綦江区', '大足区', '渝北区', '巴南区', '黔江区', '长寿区', '江津区', '合川区', '永川区', '南川区', '璧山区', '铜梁区', '潼南区', '荣昌区', '开州区', '梁平区', '武隆区', '城口县', '丰都县', '垫江县', '忠县', '云阳县', '奉节县', '巫山县', '巫溪县', '石柱土家族自治县', '秀山土家族苗族自治县', '酉阳土家族苗族自治县', '彭水苗族土家族自治县'],
  '四川省': ['成都市', '自贡市', '攀枝花市', '泸州市', '德阳市', '绵阳市', '广元市', '遂宁市', '内江市', '乐山市', '南充市', '眉山市', '宜宾市', '广安市', '达州市', '雅安市', '巴中市', '资阳市', '阿坝藏族羌族自治州', '甘孜藏族自治州', '凉山彝族自治州'],
  '贵州省': ['贵阳市', '六盘水市', '遵义市', '安顺市', '毕节市', '铜仁市', '黔西南布依族苗族自治州', '黔东南苗族侗族自治州', '黔南布依族苗族自治州'],
  '云南省': ['昆明市', '曲靖市', '玉溪市', '保山市', '昭通市', '丽江市', '普洱市', '临沧市', '楚雄彝族自治州', '红河哈尼族彝族自治州', '文山壮族苗族自治州', '西双版纳傣族自治州', '大理白族自治州', '德宏傣族景颇族自治州', '怒江傈僳族自治州', '迪庆藏族自治州'],
  '西藏自治区': ['拉萨市', '日喀则市', '昌都市', '林芝市', '山南市', '那曲市', '阿里地区'],
  '陕西省': ['西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', '延安市', '汉中市', '榆林市', '安康市', '商洛市'],
  '甘肃省': ['兰州市', '嘉峪关市', '金昌市', '白银市', '天水市', '武威市', '张掖市', '平凉市', '酒泉市', '庆阳市', '定西市', '陇南市', '临夏回族自治州', '甘南藏族自治州'],
  '青海省': ['西宁市', '海东市', '海北藏族自治州', '黄南藏族自治州', '海南藏族自治州', '果洛藏族自治州', '玉树藏族自治州', '海西蒙古族藏族自治州'],
  '宁夏回族自治区': ['银川市', '石嘴山市', '吴忠市', '固原市', '中卫市'],
  '新疆维吾尔自治区': ['乌鲁木齐市', '克拉玛依市', '吐鲁番市', '哈密市', '昌吉回族自治州', '博尔塔拉蒙古自治州', '巴音郭楞蒙古自治州', '阿克苏地区', '克孜勒苏柯尔克孜自治州', '喀什地区', '和田地区', '伊犁哈萨克自治州', '塔城地区', '阿勒泰地区', '石河子市', '阿拉尔市', '图木舒克市', '五家渠市', '北屯市', '铁门关市', '双河市', '可克达拉市', '昆玉市', '胡杨河市', '新星市'],
  '香港特别行政区': ['中西区', '湾仔区', '东区', '南区', '油尖旺区', '深水埗区', '九龙城区', '黄大仙区', '观塘区', '北区', '大埔区', '沙田区', '西贡区', '葵青区', '荃湾区', '屯门区', '元朗区', '离岛区'],
  '澳门特别行政区': ['花地玛堂区', '花王堂区', '望德堂区', '大堂区', '风顺堂区', '嘉模堂区', '路氹城', '圣方济各堂区'],
  '台湾省': ['台北市', '新北市', '桃园市', '台中市', '台南市', '高雄市', '基隆市', '新竹市', '嘉义市', '新竹县', '苗栗县', '彰化县', '南投县', '云林县', '嘉义县', '屏东县', '宜兰县', '花莲县', '台东县', '澎湖县', '金门县', '连江县']
}

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentStep = ref(0)
const resultVisible = ref(false)

// 匹配率进度条
const matchProgress = computed(() => {
  let total = 0
  if (form.value.identity) total += 25
  if (form.value.categories && form.value.categories.length > 0) total += 25
  if (form.value.scale) total += 25
  if (form.value.isDifficult) total += 25
  return total
})

/* AI辅助生成：DeepSeek网页版, 2026-4-19 */
// 进度提示文字
const progressTip = computed(() => {
  if (matchProgress.value === 0) return '开始填写，获取精准政策匹配'
  if (matchProgress.value < 50) return '再填写一些信息，匹配会更精准'
  if (matchProgress.value < 100) return '即将完成，马上查看匹配结果'
  return '已完成！点击查询获取补贴政策'
})

// 判断是否有已选信息
const hasSelectedInfo = computed(() => {
  return form.value.identity || form.value.categories.length > 0 || form.value.scale || form.value.isDifficult === '是'
})

const goBack = () => {
  router.back()
}

const form = ref({
  identity: '',
  categories: [],
  scale: '',
  province: '',  
  city: '',       
  areaDetail: '',  
  isDifficult: ''
})

const cityOptions = computed(() => {
  return cityMap[form.value.province] || []
})

const matchedPolicies = ref([
  {
    id: 1,
    name: '粮食种植补贴',
    amount: '每亩100-200元',
    condition: '种植水稻、玉米等粮食作物',
    materials: ['身份证', '土地证明', '种植面积证明'],
    phone: '12345678901'
  },
  {
    id: 2,
    name: '脱贫户教育补助',
    amount: '每学年1000-3000元',
    condition: '脱贫户子女接受教育',
    materials: ['身份证', '脱贫证明', '学籍证明'],
    phone: '12345678902'
  },
  {
    id: 3,
    name: '农业机械购置补贴',
    amount: '购置金额的30%',
    condition: '购买指定农业机械',
    materials: ['身份证', '购机发票', '行驶证'],
    phone: '12345678903'
  }
])

const nextStep = () => {
  currentStep.value++
}

const prevStep = () => {
  currentStep.value--
}

const submitForm = async () => {
  const params = new URLSearchParams()

  // 身份类型：不为空才传
  if (form.value.identity && form.value.identity.trim()) {
    params.set('identity', form.value.identity)
  }

  // 品类：多个值就用逗号分隔（假设后端支持）
  if (form.value.categories && form.value.categories.length > 0) {
    params.set('categories', form.value.categories.join(','))
  }

  // 规模
  if (form.value.scale && form.value.scale.trim()) {
    params.set('scale', form.value.scale)
  }

  // 省份
  if (form.value.province && form.value.province.trim()) {
    params.set('province', form.value.province)
  }

  // 城市
  if (form.value.city && form.value.city.trim()) {
    params.set('city', form.value.city)
  }

  // 困难身份
  if (form.value.isDifficult) {
    params.set('isDifficult', form.value.isDifficult)
  }

  // 调用政策搜索接口
  try {
    const response = await searchPolicy(params) // 假设你已经有这个 api 方法
    matchedPolicies.value = response.list || []
    resultVisible.value = true
  } catch (error) {
    ElMessage.error('政策查询失败')
  }
}
</script>

<style scoped>
.policy-match-container {
  min-height: 100vh;
  background-color: #F5F7F0;
  background-image: radial-gradient(circle at 10% 20%, rgba(46, 125, 50, 0.05) 2%, transparent 2.5%);
  background-size: 35px 35px;
}

.el-main {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
}

.el-header {
  background: white;
  color: #333;
  padding: 15px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.el-header h1 {
  margin: 0;
  font-size: 24px;
  flex: 1;
  text-align: center;
  font-weight: 600;
  color: #2e7d32;
}

.header-content .el-button {
  background-color: #2e7d32 !important;
  border-color: #2e7d32 !important;
  color: white !important;
}

.header-content .el-button:hover {
  background-color: #60ad5e !important;
  border-color: #60ad5e !important;
}

.questionnaire-container {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-top: 30px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  min-height: 550px;
  display: flex;
  flex-direction: column;
}

.question-content {
  max-width: 800px;
  margin: 40px auto;
  flex: 1;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.question-content {
  margin: 40px 0;
}

.question-content h2 {
  margin-bottom: 20px;
  font-size: 18px;
  color: #303133;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
}

/* 按钮颜色 */
.el-button--primary,
.el-button--success {
  background-color: #2e7d32 !important;
  border-color: #2e7d32 !important;
}

.el-button--primary:hover,
.el-button--success:hover {
  background-color: #60ad5e !important;
  border-color: #60ad5e !important;
}

/* 步骤条颜色 */
:deep(.el-step__title.is-finish) {
  color: #2e7d32;
}

:deep(.el-step__line.is-finish) {
  background-color: #2e7d32;
}

:deep(.el-step__icon.is-finish .el-step__icon-inner) {
  color: #2e7d32;
}

:deep(.el-step__icon.is-process) {
  background: #2e7d32;
  border-color: #2e7d32;
}

:deep(.el-step__icon.is-process .el-step__icon-inner) {
  color: white;
}

/* 单选框颜色 */
:deep(.el-radio__input.is-checked .el-radio__inner) {
  background-color: #2e7d32;
  border-color: #2e7d32;
}

:deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #2e7d32;
}

/* 复选框颜色 */
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #2e7d32;
  border-color: #2e7d32;
}

:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #2e7d32;
}

.result-container {
  max-height: 500px;
  overflow-y: auto;
}

.policy-card {
  margin-bottom: 20px;
  border-left: 4px solid #2e7d32;
}

.policy-card h4 {
  margin-top: 0;
  color: #303133;
}

.policy-card ul {
  padding-left: 20px;
  margin: 10px 0;
}

.policy-card li {
  margin-bottom: 5px;
}

/* 弹窗按钮 */
.el-dialog .el-button--primary {
  background-color: #2e7d32 !important;
  border-color: #2e7d32 !important;
}

/* ========== 页面美化增强 ========== */

/* 步骤提示样式 */
.step-hint {
  text-align: center;
  margin-top: 12px;
  font-size: 13px;
  color: #2e7d32;
  background: #e8f5e9;
  display: inline-block;
  padding: 4px 16px;
  border-radius: 20px;
  width: auto;
}

/* 选项卡片化 - 更高优先级 */
.questionnaire-container .question-content .el-radio,
.questionnaire-container .question-content .el-checkbox {
  background: #f8f9fa !important;
  padding: 12px 20px !important;
  border-radius: 12px !important;
  margin-right: 12px !important;
  margin-bottom: 12px !important;
  border: 1px solid #e8e8e8 !important;
  transition: all 0.3s ease !important;
  width: auto !important;
  display: inline-flex !important;
  align-items: center !important;
  height: auto !important;
}

.questionnaire-container .question-content .el-radio:hover,
.questionnaire-container .question-content .el-checkbox:hover {
  border-color: #2e7d32 !important;
  background: #f1f8e9 !important;
  transform: translateY(-2px) !important;
}

.questionnaire-container .question-content .el-radio.is-checked,
.questionnaire-container .question-content .el-checkbox.is-checked {
  background: #e8f5e9 !important;
  border-color: #2e7d32 !important;
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.15) !important;
}

/* 问题标题美化 */
.question-content h2 {
  margin-bottom: 24px;
  font-size: 20px;
  color: #2e7d32;
  position: relative;
  padding-left: 20px;
}

.question-content h2::before {
  content: "📋";
  position: absolute;
  left: -8px;
  top: -2px;
  font-size: 24px;
  opacity: 0.6;
}

/* 按钮美化 */
.button-group .el-button {
  padding: 10px 28px;
  border-radius: 30px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.button-group .el-button--primary,
.button-group .el-button--success {
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.2);
}

.button-group .el-button--primary:hover,
.button-group .el-button--success:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(46, 125, 50, 0.3);
}

/* 已选信息预览 */
.selected-preview {
  background: #e8f5e9;
  border-radius: 12px;
  padding: 12px 16px;
  margin: 20px 0;
}

.preview-title {
  font-size: 13px;
  color: #2e7d32;
  font-weight: 600;
  margin-bottom: 8px;
}

.preview-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preview-tag {
  background: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: #555;
  border: 1px solid #c8e6c9;
}

/* 匹配率进度条 */
.match-progress {
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  margin: 20px 0 16px;
  border: 1px solid #e8f5e9;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.progress-label {
  font-size: 14px;
  font-weight: 600;
  color: #2e7d32;
}

.progress-value {
  font-size: 18px;
  font-weight: 700;
  color: #2e7d32;
}

.progress-tip {
  font-size: 12px;
  color: #888;
  margin-top: 10px;
  text-align: center;
}

/* 政策小贴士 */
.policy-tips {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f0f7ea;
  border-radius: 12px;
  padding: 12px 16px;
  margin: 16px 0 20px;
  border: 1px solid #d4e6c3;
}

.tips-icon {
  font-size: 28px;
}

.tips-text {
  flex: 1;
  font-size: 13px;
  color: #555;
  line-height: 1.5;
}

/* 覆盖 el-carousel 高度 */
.policy-tips :deep(.el-carousel__container) {
  height: 40px;
}

.policy-tips :deep(.el-carousel__item) {
  display: flex;
  align-items: center;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 10px;
  }
  
  .el-header h1 {
    font-size: 20px;
  }
  
  .questionnaire-container {
    padding: 20px;
  }
  
  .button-group {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .result-container {
    max-height: 400px;
  }
}
</style>