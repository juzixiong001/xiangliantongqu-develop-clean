<template>
  <div class="supply-demand-container">
    <el-header>
      <div class="header-content">
        <el-button type="primary" @click="goToHome">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h1>供需大厅</h1>
      </div>
    </el-header>
    <el-main>
      <div class="filter-bar">
        <!-- 类型 -->
        <el-select v-model="filter.type" placeholder="选择类型" style="width:180px;">
          <el-option label="全部" value="" />
          <el-option label="供应" value="supply" />
          <el-option label="需求" value="demand" />
        </el-select>

        <!-- 省份 -->
        <el-select v-model="filter.province" placeholder="选择省份" clearable style="width:150px;">
          <el-option v-for="p in provinces" :key="p" :label="p" :value="p" />
        </el-select>

        <!-- 城市 -->
        <el-select v-model="filter.city" placeholder="选择城市" clearable :disabled="!filter.province" style="width:150px;">
          <el-option v-for="c in cityOptions" :key="c" :label="c" :value="c" />
        </el-select>

        <!-- 关键词输入框和搜索按钮分开写，确保事件绑定牢固 -->
        <el-input v-model="filter.keyword" placeholder="搜索关键词" clearable style="flex:1; min-width:200px;" />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>

      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="3" animated />
      </div>
      <div v-else-if="filteredItems.length === 0" class="empty-container">
        <el-empty description="暂无供需信息" />
      </div>
      <div v-else class="card-grid">
        <el-card v-for="item in filteredItems" :key="item.id" class="info-card">
          <template #header>
            <div class="card-header">
              <h3>{{ item.title }}</h3>
              <div class="card-actions">
                <el-icon class="favorite-icon" @click.stop="toggleFavorite(item)">
                  <Star :style="{ color: item.isFavorited ? '#ff8f00' : '#ccc' }" />
                </el-icon>
                <el-tag :type="getTagType(item.type)">
                  {{ item.type === 'supply' ? '供应' : item.type === 'demand' ? '需求' : item.type }}
                </el-tag>
              </div>
            </div>
          </template>
          <div class="card-content">
            <!-- 展示省、市、详细地址 -->
            <p class="area">
              📍 {{ item.province || '' }} {{ item.city || '' }} {{ item.areaDetail || item.area || item.village || '未知地区' }}
            </p>
            <p class="description">{{ item.description }}</p>
            <p class="contact">📞 {{ item.contact }}</p>
            <p class="time">🕒 {{ item.time || formatTime(item.createdAt) }}</p>
          </div>
        </el-card>
      </div>
    </el-main>
  </div>
</template>

<script setup>
import { ArrowLeft, Star } from '@element-plus/icons-vue' 
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getSupplyList, searchSupply } from '@/api/supply'
import { addFavorite, removeFavorite, getMyFavorites } from '@/api/favorite'

// ---------- 省份城市数据（直接复制过来） ----------
const provinces = [
  '北京市', '天津市', '河北省', '山西省', '内蒙古自治区',
  '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省',
  '浙江省', '安徽省', '福建省', '江西省', '山东省',
  '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区',
  '海南省', '重庆市', '四川省', '贵州省', '云南省',
  '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区',
  '新疆维吾尔自治区', '香港特别行政区', '澳门特别行政区', '台湾省'
]

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
// ---------- 数据结束 ----------

const router = useRouter()

const filter = ref({
  type: '',
  province: '',
  city: '',
  keyword: ''
})

const loading = ref(false)
const items = ref([])

// 计算城市选项
const cityOptions = computed(() => {
  return cityMap[filter.value.province] || []
})

// 获取供需列表
const fetchSupplyList = async () => {
  loading.value = true
  try {
    const data = await getSupplyList()
    items.value = (data.list || []).map(item => ({
      ...item,
      isFavorited: false,
      favoriteId: null
    }))
  } catch (error) {
    console.error('获取供需列表失败:', error)
    ElMessage.error('获取供需列表失败')
    items.value = []
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = async () => {
  console.log('✅ 搜索按钮被点击了！') 
  loading.value = true
  try {
    // 1. 构建参数对象，只传有值的字段
    const params = {}

    // 类型：有值才传，但必须传 'supply' 或 'demand'，不要传 '供应/需求'
    if (filter.value.type) {
      params.type = filter.value.type // 直接传 'supply' 或 'demand'
    }

    // 省份：去掉 '省/市/自治区' 后缀，和后端存储保持一致
    if (filter.value.province && filter.value.province.trim()) {
      let provinceValue = filter.value.province.trim()
      provinceValue = provinceValue.replace(/省$/, '').replace(/市$/, '').replace(/自治区$/, '')
      params.province = provinceValue
    }

    // 城市：去掉 '市' 后缀
    if (filter.value.city && filter.value.city.trim()) {
      let cityValue = filter.value.city.trim()
      cityValue = cityValue.replace(/市$/, '')
      params.city = cityValue
    }

    // 关键词：有值且不是空字符串才传（后端用 title 接收）
    if (filter.value.keyword && filter.value.keyword.trim()) {
      params.title = filter.value.keyword.trim()
    }

    // 分页固定传
    params.page = 1
    params.size = 10

    // 2. 打印一下参数，确认组装正确
    console.log('即将发送给后端的参数:', params)

    // 3. 调用 searchSupply 接口（对应 /api/posts/search）
    const data = await searchSupply(params)

    // 4. 把后端返回的新数据更新到 items 中
    items.value = (data.list || []).map(item => ({
      ...item,
      isFavorited: false,
      favoriteId: null
    }))

  } catch (error) {
    console.error('搜索失败:', error)
    ElMessage.error('搜索失败')
    items.value = []
  } finally {
    loading.value = false
  }
}

// 加载收藏状态
const loadFavoritesStatus = async () => {
  try {
    const res = await getMyFavorites()
    const favoriteMap = new Map() // targetId -> favoriteId
    ;(res.list || []).forEach(item => {
      favoriteMap.set(item.targetId, item.id)
    })
    items.value.forEach(item => {
      const favoriteId = favoriteMap.get(item.id)
      item.isFavorited = !!favoriteId
      item.favoriteId = favoriteId || null
    })
  } catch (err) {
    console.error('获取收藏状态失败', err)
  }
}

// 切换收藏
const toggleFavorite = async (item) => {
  try {
    if (item.isFavorited) {
      await removeFavorite(item.favoriteId)
      item.isFavorited = false
      item.favoriteId = null
      ElMessage.success('已取消收藏')
    } else {
      const res = await addFavorite({
        targetType: 'post',
        targetId: item.id
      })
      item.isFavorited = true
      item.favoriteId = res.id
      ElMessage.success('收藏成功')
    }
  } catch (error) {
    console.error('收藏操作失败', error)
    ElMessage.error('操作失败，请重试')
  }
}

// 筛选（支持省、市）
// 筛选（支持省、市）
const filteredItems = computed(() => {
  let result = items.value.filter(item => {
    // 类型筛选
    if (filter.value.type !== '') {
      // 注意：后端返回的 item.type 值可能为 '供应' 或 '需求'，需要做映射
      const typeMap = { 'supply': '供应', 'demand': '需求' }
      if (item.type !== typeMap[filter.value.type]) return false
    }
    // 省份筛选：使用 includes 进行模糊匹配，避免 '湖南' 和 '湖南省' 不一致的问题
    if (filter.value.province && item.province && !item.province.includes(filter.value.province.replace(/省$/, '').replace(/市$/, ''))) return false
    // 城市筛选同理
    if (filter.value.city && item.city && !item.city.includes(filter.value.city.replace(/市$/, ''))) return false
    // 关键词筛选
    if (filter.value.keyword !== '') {
      const kw = filter.value.keyword.toLowerCase()
      const titleMatch = item.title && item.title.toLowerCase().includes(kw)
      const descMatch = item.content && item.content.toLowerCase().includes(kw)
      if (!titleMatch && !descMatch) return false
    }
    return true
  })
  return result
})

const getTagType = (type) => {
  switch (type) {
    case '供应': return 'success'
    case '需求': return 'danger'
    default: return ''
  }
}

const formatTime = (timeStr) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const goToHome = () => router.push('/')
const viewDetail = (item) => router.push(`/supply-detail/${item.id}`)

onMounted(async () => {
  await fetchSupplyList()
  await loadFavoritesStatus()
})
</script>

<style scoped>
.supply-demand-container {
  min-height: 100vh;
  background-color: #F5F7F0;
  background-image: radial-gradient(circle at 10% 20%, rgba(46, 125, 50, 0.05) 2%, transparent 2.5%);
  background-size: 35px 35px;
  padding-bottom: 20px;
}
.el-main {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 20px 0;
}
.el-header {
  background: white;
  color: #333;
  padding: 15px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #f0f0f0;
}
.el-header h1 {
  margin: 0;
  font-size: 24px;
  flex: 1;
  text-align: center;
  font-weight: 600;
  color: #2e7d32;
}
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  gap: 16px;
}
.filter-bar {
  display: flex;
  gap: 30px;
  margin: 30px 0;
  padding: 30px;
  background: linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%);
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(46, 125, 50, 0.12);
  align-items: center;
  border: 1px solid #e8f5e9;
  transition: all 0.3s ease;
}

.filter-bar:hover {
  box-shadow: 0 12px 32px rgba(46, 125, 50, 0.18);
  transform: translateY(-2px);
}
.filter-bar .el-select,
.filter-bar .el-input {
  min-width: 220px;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}
.info-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}
.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #2e7d32;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  background-color: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}
.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-right: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.favorite-icon {
  cursor: pointer;
  font-size: 20px;
  transition: transform 0.2s;
}
.favorite-icon:hover {
  transform: scale(1.1);
}
.card-content {
  padding: 20px;
}
.area, .contact, .time {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}
.area::before { content: '📍'; margin-right: 6px; }
.contact::before { content: '📞'; margin-right: 6px; color: #2e7d32; }
.time::before { content: '🕒'; margin-right: 6px; }
.description {
  margin-bottom: 16px;
  line-height: 1.6;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
@media (max-width: 768px) {
  .filter-bar { flex-direction: column; align-items: stretch; gap: 15px; padding: 20px; }
  .card-grid { grid-template-columns: 1fr; }
}
</style>