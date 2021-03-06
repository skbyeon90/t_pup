'use strict';

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var utils = require('../utils');
var assert = require( 'chai' ).assert;
var browser = undefined;
var page = undefined;

const puppeteer = require('puppeteer');

module.exports = app => {

     app.get('/', (req,res) => {
        res.render('register.html');
     });

     app.get('/about', (req,res) => {
        console.log('in about.html');
        res.render('about.html');
     });

     app.post('/', urlencodedParser, (req, res) => {
        //res.render('wait.html');
        (async() => {
            browser = await puppeteer.launch({
            headless: true,
            ignoreHTTPSErrors: true, // doesn't matter
            args: [
                '--ignore-certificate-errors',
                '--ignore-certificate-errors-spki-list '
            ]
            })
            page = await browser.newPage();
            await page.setViewport({ width: 1280, height: 800 })

            //utils.setPage(page);

            page.on('console', msg => console.log('PAGE LOG:', msg.text()));

            //start coverage trace
            await Promise.all([
              page.coverage.startJSCoverage(),
              page.coverage.startCSSCoverage()
            ]);


            try{
                // 스마트스토어 페이지 진입
                await page.goto('http://dev.sell.smartstore.naver.com/#/login', {waitUntil: 'networkidle0'});

                // 판매자 로그인
                await utils.clearAndType(page, '//input[@id="loginId"]', req.body.tID);
                await utils.clearAndType(page, '//input[@id="loginPassword"]', 'qatest123');
                await utils.click(page, '//button[@id="loginButton"]');

                // 상품등록 메뉴 진입
                await utils.click(page, '//div[@id="seller-lnb"]/div/div[1]/ul/li[1]/a');
                await utils.click(page, '//div[@id="seller-lnb"]/div/div[1]/ul/li[1]/ul/li[2]/a');

                // 쇼핑윈도, 스마트스토어 노출 변수 초기화
                var isSmartStore = true;
                var isShoppingWindow = true;
                if(req.body.chkSmartStore == undefined){
                    isSmartStore = false;
                }
                if(req.body.chkWindow == undefined){
                    isShoppingWindow = false;
                }
                // 카테고리 선택
                await utils.click(page, '//input[@id="r1_2_2"]'); // [카테고리명 선택]
                switch(req.body.sProductCategory){
                    case 'department': // 패션잡화>벨트>멜빵
                        await utils.click(page, '//div[@ng-if="vm.showPcDepthSearch()"]/div/ul/li[10]/a'); // 패션잡화
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 2"]/ul/li[5]/a'); // 벨트
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 2"]/ul/li[5]/a '); // 벨트
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 3"]/ul/li[3]/a'); // 멜빵
                        break;
                    case 'outlet': // 패션잡화>지갑>머니클립
                        await utils.click(page, '//div[@ng-if="vm.showPcDepthSearch()"]/div/ul/li[10]/a'); // 패션잡화
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 2"]/ul/li[16]/a'); // 지갑
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 3"]/ul/li[4]/a'); // 머니클립
                        break;
                    case 'style': // 패션의류>남성의류>티셔츠
                        await utils.click(page, '//div[@ng-if="vm.showPcDepthSearch()"]/div/ul/li[9]/a'); // 패션의류
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 2"]/ul/li[3]/a'); // 남성의류
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 3"]/ul/li[16]/a'); // 티셔츠
                        break;
                     case 'designer': // 패션잡화>패션소품>숄
                        await utils.click(page, '//div[@ng-if="vm.showPcDepthSearch()"]/div/ul/li[10]/a'); // 패션의류
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 2"]/ul/li[17]/a'); // 패션소품
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 3"]/ul/li[4]/a'); // 숄
                        break;
                     case 'beauty': // 화장품/미용>클렌징>클렌징비누
                        await utils.click(page, '//div[@ng-if="vm.showPcDepthSearch()"]/div/ul/li[11]/a'); // 화장품/미용
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 2"]/ul/li[11]/a'); // 클렌징
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 3"]/ul/li[5]/a'); // 클렌징비누
                        break;
                     case 'living': // 가구/인테리어>수납가구>공간박스
                        await utils.click(page, '//div[@ng-if="vm.showPcDepthSearch()"]/div/ul/li[1]/a'); // 가구/인테리어
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 2"]/ul/li[6]/a'); // 수납가구
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 3"]/ul/li[4]/a'); // 공간박스
                        break;
                     case 'directfarm': // 식품>축산>양고기
                        await utils.click(page, '//div[@ng-if="vm.showPcDepthSearch()"]/div/ul/li[6]/a'); // 식품
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 2"]/ul/li[14]/a'); // 축산
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 3"]/ul/li[7]/a'); // 양고기
                        break;
                     case 'localfood': // 식품>반찬>장조림
                        await utils.click(page, '//div[@ng-if="vm.showPcDepthSearch()"]/div/ul/li[6]/a'); // 식품
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 2"]/ul/li[9]/a'); // 반찬
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 3"]/ul/li[5]/a'); // 장조림
                        break;
                     case 'homemeal': // 식품>가공식품>쿠킹박스>볶음/튀김
                        await utils.click(page, '//div[@ng-if="vm.showPcDepthSearch()"]/div/ul/li[6]/a'); // 식품
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 2"]/ul/li[2]/a'); // 가공식품
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 3"]/ul/li[36]/a'); // 쿠킹박스
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 4"]/ul/li[6]/a'); // 볶음/튀김
                        break;
                     case 'cvs': // 식품>냉동/간편조리식품>만두
                        await utils.click(page, '//div[@ng-if="vm.showPcDepthSearch()"]/div/ul/li[6]/a'); // 식품
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 2"]/ul/li[6]/a'); // 냉동/간편조리식품
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 3"]/ul/li[5]/a'); // 만두
                        break;
                     case 'kids': // 출산/육아>이유식용품>유아식기
                        await utils.click(page, '//div[@ng-if="vm.showPcDepthSearch()"]/div/ul/li[8]/a'); // 출산/육아
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 2"]/ul/li[28]/a'); // 이유식용품
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 3"]/ul/li[6]/a'); // 유아식기
                        break;
                    case 'pet': // 생활/건강>반려동물>강아지 미용/목욕>드라이기
                        await utils.click(page, '//div[@ng-if="vm.showPcDepthSearch()"]/div/ul/li[4]/a'); // 생활/건강
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 2"]/ul/li[13]/a'); // 반려동물
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 3"]/ul/li[5]/a'); // 강아지 미용/목욕
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 4"]/ul/li[3]/a'); // 드라이기
                        break;
                    case 'play': // 디지털/가전>멀티미디어장비>PC헤드셋
                        await utils.click(page, '//div[@ng-if="vm.showPcDepthSearch()"]/div/ul/li[3]/a'); // 디지털/가전
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 2"]/ul/li[11]/a'); // 멀티미디어장비
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 3"]/ul/li[2]/a'); // PC헤드셋
                        break;
                    case 'art': // 가구/인테리어> 수납가구> 수납장
                        await utils.click(page, '//div[@ng-if="vm.showPcDepthSearch()"]/div/ul/li[1]/a'); // 가구/인테리어
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 2"]/ul/li[6]/a'); // 수납가구
                        await utils.click(page, '//div[@ng-show="vm.showLevel >= 3"]/ul/li[8]/a'); // 공간박스
                        break;
                    default:
                        console.log("cateogory none.");
                        break;
                }

                console.log(req.body.sProductCategory);

                var selected = await utils.getText(page, '//p[@class="info-result text-info ng-scope"]/strong')
                console.log(selected);

                // 상품명
                await utils.clearAndType(page, '//input[@name="product.name"]', req.body.tProductName);
                var strProductName = await utils.getValue(page, '//input[@name="product.name"]');
                assert.strictEqual(req.body.tProductName, strProductName);

                // 판매가
                await utils.clearAndType(page, '//input[@name="product.salePrice"]', req.body.nProductPrice);
                var strProductPrice = await utils.getValue(page, '//input[@name="product.salePrice"]');
                assert.strictEqual(req.body.nProductPrice, strProductPrice);

                // 판매가/과세유형
                switch(req.body.selProductTax){
                    case 'tax':
                        await utils.click(page, '//input[@id="taxType_TAX"]');
                        break;
                    case 'dutyfree':
                        await utils.click(page, '//input[@id="taxType_DUTYFREE"]');
                        break;
                    case 'small':
                        await utils.click(page, '//input[@id="taxType_SMALL"]');
                        break;
                    default:
                        console.log("tax error.");
                        break;
                 }

                // 판매가/할인설정
                if(req.body.chkProductSale != undefined)
                {
                    console.log('할인설정 ON');
                    await utils.click(page, '//input[@id="r3_1_total"]');

                    // 할인가
                    await utils.clearAndType(page, '//input[@name="product.customerBenefit.immediateDiscountPolicy.discountMethod.value"]', req.body.nSaleValue);
                    var strSaleValue = await utils.getValue(page, '//input[@name="product.customerBenefit.immediateDiscountPolicy.discountMethod.value"]');
                    assert.strictEqual(req.body.nSaleValue, strSaleValue);

                    // 할인 단위 ( %, 원 )
                    try{
                        var nIdex = (req.body.selSaleType == 'won' ? 2 : 1);
                        await page.evaluate(({nIdex}) => {
                            document.querySelector('//div[@id="error_immediateDiscountPolicy_all_value"]/div[1]/div/div/ul/li['+nIdex+']/a').click();
                        }, {nIdex});
                        console.log('인덱스 : ' + nIdex);
                    }
                    catch(error){
                        console.log('click(index) error : ' + error);
                    }
                }

                // 재고 수량
                await utils.clearAndType(page, '//input[@id="stock"]', req.body.nProductAmount);
                var strStockValue = await utils.getValue(page, '//input[@id="stock"]');
                assert.strictEqual(req.body.nProductAmount, strStockValue);

                // 옵션 영역 펼치기
                if(req.body.chkSelectOption != undefined
                   || req.body.chkInputOption != undefined)
                {
                    await utils.click(page, '//div[@server-field-errors="product.detailAttribute.optionInfo.*"]');
                    console.log("옵션 영역 on");
                }

                // 선택형 옵션 chkSelectOption
                if(req.body.chkSelectOption != undefined)
                {
                    console.log("선택형 옵션 on");
                    // 선택형 옵션 펼치기
                    await utils.click(page, '//input[@id="option_choice_type_true"]');

                    // 선택형 옵션 -  옵션유형
                    var vOptType;
                    console.log(req.body.radOptionType);
                    if(req.body.radOptionType == 'radOptionTypeSolo')
                    {
                        await utils.click(page, '//input[@value="SIMPLE"]'); // 단독형
                        vOptType = "SIMPLE";
                    }
                    else
                    {
                        await utils.click(page, '//input[@value="COMBINATION"]'); // 조합형
                        vOptType = "COMBINATION";
                    }

                    // 선택형 옵션 - 정렬순서
                    console.log(req.body.selSelectOptionOrder);
                    switch(req.body.selSelectOptionOrder)
                    {
                        case 'orderRegistr' :
                            await utils.click(page, '//div[@data-value="CREATE"]');
                            break;
                        case 'orderAbc' :
                            await utils.click(page, '//div[@data-value="ABC"]');
                            break;
                         case 'orderLowPrice' :
                            await utils.click(page, '//div[@data-value="LOW_PRICE"]');
                            break;
                        case 'ordeorderHighPricer' :
                            await utils.click(page, '//div[@data-value="HIGH_PRICE"]');
                            break;
                        default :
                            console.log("선택형 옵션 정렬순서 오류");
                            break;
                    }

                    console.log(req.body.selSelectOptionNum);

                    // 선택형 옵션 -  옵션명 개수
                    await utils.click(page, '//div[@data-value="1"].item');
                    switch(req.body.selSelectOptionNum){
                    case '1':
                        // 옵션 개수 - 1개 선택
                        await utils.click(page, '//div[@ng-show="vm.isChoiceType"]/div/div/div/div/div /div/div[2]/div/div');

                        // 개별 옵션 입력
                        await utils.type(page, '//input[@id="choice_option_name0"]', '컬러');
                        await utils.type(page, '//input[@id="choice_option_value0"]', 'RED,BLUE,YELLOW');
                        break;
                    case '2':
                        // 옵션 개수 - 2개 선택
                        await utils.click(page, '//div[@ng-show="vm.isChoiceType"]/div/div/div/div/div /div/div[2]/div/div[2]');

                        // 개별 옵션 입력
                        await utils.type(page, '//input[@id="choice_option_name0"]', '컬러');
                        await utils.type(page, '//input[@id="choice_option_value0"]', 'RED,BLUE,YELLOW');
                        await utils.type(page, '//input[@id="choice_option_name1"]', '사이즈');
                        await utils.type(page, '//input[@id="choice_option_value1"]', 'S,M,L');
                        break;
                    case '3':
                        // 옵션 개수 - 3개 선택
                        await utils.click(page, '//div[@ng-show="vm.isChoiceType"]/div/div/div/div/div /div/div[2]/div/div[3]');

                        // 개별 옵션 입력
                        await utils.type(page, '//input[@id="choice_option_name0"]', '컬러');
                        await utils.type(page, '//input[@id="choice_option_value0"]', 'RED,BLUE,YELLOW');
                        await utils.type(page, '//input[@id="choice_option_name1"]', '사이즈');
                        await utils.type(page, '//input[@id="choice_option_value1"]', 'S,M,L');
                        await utils.type(page, '//input[@id="choice_option_name2"]', '케이스');
                        await utils.type(page, '//input[@id="choice_option_value2"]', 'WHITE,BLACK,BROWN');
                        break;
                    default:
                        console.log("선택형 옵션 - 개수 error");
                        break;
                    }

                    // [옵션목록 적용] 버튼 클릭
                    await utils.click(page, '//a[@ng-click="vm.submitToGrid()"]');

                    // 조합형 옵션이면 재고수량 입력
                    if(vOptType == "COMBINATION")
                    {
                        // 옵션목록 전체 선택
                        await utils.click(page, '//div[@id="center"]/div/div.ag-header/div.ag-header-viewport/div/div[2]/div[1]/div/label/input');

                        // 개별 옵션 재고수량 입력 후, 적용
                        await utils.type(page, '//input[@ng-model="vm.bulkStockQuantity"]', '10');
                        await utils.click(page, '//a[@ng-click="vm.modifySelectedRowByBulk()"]');
                    }
                 }

                // 직접입력형 옵션 chkSelectOption
                if(req.body.chkInputOption != undefined)
                {
                    console.log("직접입력형 옵션 on");

                    // 직접입력형 옵션 펼치기
                    await utils.click(page, '//input[@id="option_direct_type_true"]');

                    // 옵션 개수
                    switch(req.body.selInputOptionNum){
                    case '1':
                        // 옵션 개수 선택
                        await utils.click(page, '//div[@ng-show="vm.isCustomType"]/div/div/div/div/div/div[2]/div/div[1]');

                        // 개별 옵션 입력
                        await utils.type(page, '//input[@id="custom_option_name0"]', '컬러');
                        break;
                    case '2':
                        // 옵션 개수 선택
                        await utils.click(page, '//div[@ng-show="vm.isCustomType"]/div/div/div/div/div/div[2]/div/div[2]');

                        // 개별 옵션 입력
                        await utils.type(page, '//input[@id="custom_option_name0]', '컬러');
                        await utils.type(page, '//input[@id="custom_option_name1]', '사이즈');
                        break;
                    case '3':
                        await utils.click(page, '//div[@ng-show="vm.isCustomType"]/div/div/div/div/div/div[2]/div/div[3]');

                        // 개별 옵션 입력
                        await utils.type(page, '//input[@id="custom_option_name0]', '컬러');
                        await utils.type(page, '//input[@id="custom_option_name1]', '사이즈');
                        await utils.type(page, '//input[@id="custom_option_name2]', '케이스');
                        break;
                    case '4':
                        // 옵션 개수 선택
                        await utils.click(page, '//div[@ng-show="vm.isCustomType"]/div/div/div/div/div/div[2]/div/div[4]');

                        // 개별 옵션 입력
                        await utils.type(page, '//input[@id="custom_option_name0]', '컬러');
                        await utils.type(page, '//input[@id="custom_option_name1]', '사이즈');
                        await utils.type(page, '//input[@id="custom_option_name2]', '케이스');
                        await utils.type(page, '//input[@id="custom_option_name3]', '이어폰');
                        break;
                    case '5':
                        // 옵션 개수 선택
                        await utils.click(page, '//div[@ng-show="vm.isCustomType"]/div/div/div/div/div/div[2]/div/div[5]');

                        // 개별 옵션 입력
                        await utils.type(page, '//input[@id="custom_option_name0]', '컬러');
                        await utils.type(page, '//input[@id="custom_option_name1]', '사이즈');
                        await utils.type(page, '//input[@id="custom_option_name2]', '케이스');
                        await utils.type(page, '//input[@id="custom_option_name3]', '이어폰');
                        await utils.type(page, '//input[@id="custom_option_name4]', '마이크');
                        break;
                    default:
                        console.log("직접입력형 옵션 - 개수 error");
                        break;
                    }
                }

                // 옵션 영역 닫음
                if(req.body.chkSelectOption != undefined
                   || req.body.chkInputOption != undefined)
                {
                    // 옵션 영역 닫기
                    await utils.click(page, '//div[@server-field-errors="product.detailAttribute.optionInfo.*"]');
                    console.log("옵션 영역 off");
                }

                // 상품이미지 - 대표이미지
                await utils.click(page, '//ncp-photo-infra-image-upload[@id="representImage"]/div/div/div/ul/li/div/a');

                // 상품이미지 - 내사진 - file upload
                var filepath = __dirname + '\\..\\images\\product_image.jpg';
                await utils.uploadFile(page, '//input[@type="file"]', filepath);

                // 상품이미지 - 추가이미지
                await utils.click(page, '//ncp-photo-infra-image-upload[@id="optionalImages"]/div/div/div/ul/li/div/a');

                // 상품이미지 - 추가이미지 - file upload
                var optionalfilepath = __dirname + '\\..\\images\\product_image_optional.jpeg';
                await utils.uploadFile(page, '//input[@type="file"][@multiple="multiple"]', optionalfilepath);

                // 상세설명
                if(isShoppingWindow)
                {
                    // SmartEditor 3.0
                    await utils.click(page, '//button[@ng-click="vm.editorLoad($event)"]');

                    await page.waitFor(5000);

                    const pages = await browser.pages();
                    const popup = pages[pages.length - 1];

                    console.log('page lenghth : ' + pages.length);

                    //await utils.click(popup, '.__se_pop_close.btn_close_pop');

                    await utils.click(popup, '//button[@title="구분선"]');
                    await utils.click(popup, '//a[@id="se_top_publish_btn"]');
                }
                else
                {
                    // HTML
                    await utils.click(page, '//a[@ng-click="vm.changeEditorType(vm.constants.EDITOR_TYPE.NONE)"]');
                    await utils.type(page, '//div[@class="content write-html ng-scope"]/div/textarea', '상품 상세설명');
                }

                // 상품주요정보
                if(req.body.chkProductMajorInfo != undefined)
                {
                    await utils.click(page, '//div[@id="_prod-attr-section"]/div');

                    console.log("상품주요정보 on");

                    // 모델명
                    await utils.type(page, '//input[@name="product.detailAttribute.naverShoppingSearchInfo.modelName"]', 'M');

                    // 브랜드명
                    await utils.clearAndType(page, '//ncp-brand-manufacturer-input[@model-type="brand"]/div/div/div/div/div/div/input', 'd');
                    await utils.click(page, '//div[@data-value="15074"]');

                    // 상품주요정보 - 상품속성
                    switch(req.body.sProductCategory){
                        case 'department': // 패션잡화>벨트>멜빵
                            await utils.click(page, '//div[@data-value="10197460"]'); // 주요소재 : 가죽
                            await utils.click(page, '//div[@data-value="10557684"]'); // 넓이 : 미디엄
                            break;
                        case 'outlet': // 패션잡화>지갑>머니클립
                            await utils.click(page, '//div[@data-value="10197460"]'); // 주요소재 : 가죽
                            break;
                        case 'style': // 패션의류>남성의류>티셔츠
                            await utils.click(page, '//div[@ng-if="categoryAttribute.attribute.attributeClassificationType === \'MULTI_SELECT\'"]/div/div/label/input'); // 주요소재 : 데님
                            await utils.click(page, '//div[@data-value="10588283"]'); // 소매기장 : 민소매
                            break;
                         case 'designer': // 패션잡화>패션소품>숄
                            await utils.click(page, '//div[@data-value="10030859"]'); // 주요소재 : 니트
                            await utils.click(page, '//div[@data-value="10040049"]'); // 패턴 : 무지
                            break;
                        default:
                             break;
                    }

                    // 상품주요정보 - 원산지
                    console.log(req.body.selProductOrigin);
                    switch(req.body.selProductOrigin){
                        case 'domestic':
                            // 국내
                            await utils.click(page, '//div[@class="selectize-dropdown-content"]/div[@data-value="LOCAL"]');
                            break;
                        case 'imported':
                            // 수입산
                            await utils.click(page, '//div[@class="selectize-dropdown-content"]/div[@data-value="IMPORT"]');

                            // 원산지/북아메리카
                            await utils.click(page, '//div[@class="selectize-dropdown-content"]/div[@data-value="0204"]');

                            // 원산지/북아메리카/미국
                            await utils.click(page, '//div[@class="selectize-dropdown-content"]/div[@data-value="0204000"]');

                            // 수입사 입력
                            await utils.type(page, '//div[@class="fix-area2"]/div/div/input', '수입사 테스트');
                            break;
                        case 'etc':
                            // 기타
                            await utils.click(page, '//div[@class="selectize-dropdown-content"]/div[data-value="ETC"]');
                            break;
                        default:
                            await utils.click(page, '//div[@class="selectize-dropdown-content"]/div[data-value="LOCAL"]');
                            break;
                    }

                    // 상품주요정보 - 상품상태
                    if(req.body.selProductStatus == "used"){
                        console.log("중고");
                        await utils.click(page, '//input[@id="saleType_OLD"]');
                    }

                    // 상품주요정보 - 주문제작 상품(현재 스펙변경된 상태라 주석처리)
    //                var customMade = false;
    //                if(req.body.chkCustomMade != undefined)
    //                {
    //                    customMade = true; // 배송/발송예정일 설정 위한 변수
    //
    //                    // 체크박스가 체크됐는지
    //                    var selectorCheckbox = '//input[@ng-model="vm.product.detailAttribute.customMadeInfo.customMade"].ng-pristine.ng-untouched.ng-valid.ng-empty';
    //                    if(await utils.isElementExists(page, selectorCheckbox) == true)
    //                    {
    //                        console.log('주문제작 상품-체크안된 상태.');
    //                        await utils.click(page, selectorCheckbox);
    //                    }
    //                    else
    //                    {
    //                        console.log('주문제작 상품-체크된 상태.');
    //                    }

                    // 제조일자
                    await utils.click(page, '//input[@name="product.detailAttribute.manufactureDate"]');
                    await utils.click(page, '//button[starts-with(@class, "left")]');
                    await utils.click(page, '//div[@class="datetimepicker-body day-view"]/table/tbody/tr/td/div/span');

                    // 상품주요정보 - 미성년가 구매 가능여부 - (default : 가능)
                    if(req.body.radIsBuyChildren == "impossible")
                    {
                        console.log("미성년자 구매 불가능");
                        await utils.click(page, '//input[@id="child2"]');
                    }
                }
                else // 상품주요정보 - 상품속성, 모델명, 브랜드명, 제조일자는 default로 입력
                {
                    await utils.click(page, '//div[@id="_prod-attr-section"]/div');

                    console.log("상품주요정보 on");

                    // 모델명
                    await utils.clearAndType(page, '//input[@name="product.detailAttribute.naverShoppingSearchInfo.modelName"]', 'M');

                    // 브랜드명
                    await utils.clearAndType(page, '//ncp-brand-manufacturer-input[@model-type="brand"]/div/div/div/div/div/div/input', 'd');
                    await utils.click(page, '//div[@data-value="15074"]');

                    // 상품주요정보 - 상품속성
                    switch(req.body.sProductCategory){
                        case 'department': // 패션잡화>벨트>멜빵
                            await utils.click(page, '//div[@data-value="10197460"]'); // 주요소재 : 가죽
                            await utils.click(page, '//div[@data-value="10557684"]'); // 넓이 : 미디엄
                            break;
                        case 'outlet': // 패션잡화>지갑>머니클립
                            await utils.click(page, '//div[@data-value="10197460"]'); // 주요소재 : 가죽
                            break;
                        case 'style': // 패션의류>남성의류>티셔츠
                            await utils.click(page, '//div[@ng-if="categoryAttribute.attribute.attributeClassificationType === \'MULTI_SELECT\'"]/div/div/label/input'); // 주요소재 : 데님
                            await utils.click(page, '//div[@data-value="10588283"]'); // 소매기장 : 민소매
                            break;
                         case 'designer': // 패션잡화>패션소품>숄
                            await utils.click(page, '//div[@data-value="10030859"]'); // 주요소재 : 니트
                            await utils.click(page, '//div[@data-value="10040049"]'); // 패턴 : 무지
                            break;
                        default:
                             break;
                    }

                    // 제조일자
                    await utils.click(page, '//input[@name="product.detailAttribute.manufactureDate"]');
                    await utils.click(page, '//button[starts-with(@class, "left")]');
                    await utils.click(page, '//div[@class="datetimepicker-body day-view"]/table/tbody/tr/td/div/span');
                }

                // 상품정보제공고시
                if(req.body.chkProductInfoNotice != undefined)
                {
                    console.log("상품제공고시 on");

                    // 상품정보 제공고시 영역 열기
                    await utils.click(page, '//div[@server-field-errors="product.detailAttribute.productInfoProvidedNotice.*"]');

                    // 상품군
                    await utils.click(page, '//ui-view[@name="provided-notice"]/div/fieldset/div/div/div[2]/div/div/div[1]/div/div');

                    // 상품군 - 의류 선택
                    await utils.click(page, '//div[@data-value="WEAR"]');

                    // 제품소재
                    await utils.type(page, '//textarea[@id="prd"]', req.body.tProductMaterial);
                    var strProductMaterial = await utils.getValue(page, '//textarea[@id="prd"]');
                    //assert.strictEqual(req.body.tProductMaterial, strProductMaterial);

                    // 치수명
                    await utils.clearAndType(page, '//input[@id="prd_size"]', req.body.tProductSize);
                    var strProductSize = await utils.getValue(page, '//input[@id="prd_size"]');
                    assert.strictEqual(req.body.tProductSize, strProductSize);

                    // 색상
                    await utils.clearAndType(page, '//input[@id="prd_col"]', req.body.tProductColor);
                    var strProductColor = await utils.getValue(page, '//input[@id="prd_col"]');
                    assert.strictEqual(req.body.tProductColor, strProductColor);

                    // 제조자
                    await utils.clearAndType(page, '//form[@id="productForm"]/ng-include/ui-view[14]/div/fieldset/div/div/div[3]/ng-include/div/div[4]/div/ncp-brand-manufacturer-input/div/div/div/div/div/div[1]/input', req.body.tProductManufacturer);
                    var strManufacturer = await utils.getValue(page, '//form[@id="productForm"]/ng-include/ui-view[14]/div/fieldset/div/div/div[3]/ng-include/div/div[4]/div/ncp-brand-manufacturer-input/div/div/div/div/div/div[1]/input');
                    await utils.click(page, '//div[@data-value="131746"]');
                    assert.strictEqual(req.body.tProductManufacturer, strManufacturer);

                    // 세탁방법 및 취급시 주의사항
                    await utils.clearAndType(page, '//textarea[@id="prd_caution"]',req.body.tProductPrecautions);
                    var strProductCaution = await utils.getValue(page, '//textarea[@id="prd_caution"]');
                    assert.strictEqual(req.body.tProductPrecautions, strProductCaution);

                    // 제조년월
                    await utils.click(page, '//input[@ng-click="vm.dateHandle(true, true)"]');
                    await utils.clearAndType(page, '//div[@ng-show="vm.noticeType !== \'GIFT_CARD\'"]/div/input', req.body.tManuYearMonth);
                    var strProductYearMonth = await utils.getValue(page, '//div[@ng-show="vm.noticeType !== \'GIFT_CARD\'"]/div/input');
                    assert.strictEqual(req.body.tManuYearMonth, strProductYearMonth);

                    // 품질보증기준
                    await utils.clearAndType(page, '//textarea[@id="prd_quality"]', req.body.tQualityStandards);
                    var strProductQuality = await utils.getValue(page, '//textarea[@id="prd_quality"]');
                    assert.strictEqual(req.body.tQualityStandards, strProductQuality);

                    // AS 책임자
                    await utils.clearAndType(page, '//input[@id="prd_as"]', req.body.tAsManager);
                    var strProductAS = await utils.getValue(page, '//input[@id="prd_as"]');
                    assert.strictEqual(req.body.tAsManager, strProductAS);
                }

                // 배송
                if(req.body.chkDelivery != undefined)
                {
                    // 배송영역 펼침
                    console.log("배송 on");
                    await utils.click(page, '//div[@server-field-errors="product.deliveryInfo.*"]');

                    // radIsDelivery(delivery, none_delivery) 배송여부
                    if(req.body.radIsDelivery == "none_delivery")
                    {
                        // 배송없음
                        await utils.click(page, '//input[@id="rdelivery_no"]');
                    }
                    else
                    {
                        // 배송 있음
                        await utils.click(page, '//input[@id="rdelivery"]');

                        // radDeliveryProperty(normal, today) 배송속성
                        if(req.body.radDeliveryProperty == "today") // 오늘출발
                        {
                            // [오늘출발] 클릭
                            await utils.click(page, '//input[@id="TODAY"]');
                        }
                        else
                        {
                            // 현재 주문제작 스펙 변경된 상태
    //                        if(customMade == true) // 주문 제작 상품인 경우
    //                        {
    //                            // 발송예정일 설정
    //                            await await utils.click(page, '//div[@ng-if="::vm.viewData.customMade === true || vm.formType === \'BULK\'"]/div')
    //                            await utils.click(page, '//div[@data-value="SEVEN"]');
    //                        }
                        }

                        // 배송방법
                        if(req.body.radDeliveryType == "deliveryDirect") // 직접배송
                            await utils.click(page, '//input[@id="DIRECT"]');
                        else
                            await utils.click(page, '//input[@id="DELIVERY"]');

                        // chkReceiveVisit 방문수령
                        if(req.body.chkReceiveVisit != undefined)
                        {
                            console.log('방문수령');
                            // [방문수령]
                            var selectorCheckbox = '//input[@name="visit_receipt"][@class="ng-pristine ng-untouched ng-valid ng-empty"]';
                            if(await utils.isElementExists(page, selectorCheckbox) == true)
                            {
                                console.log('방문수령-체크안된 상태.');

                                // 방문수령 체크박스 클릭
                                await utils.click(page, selectorCheckbox);

                                // [판매자 주소록] 버튼 클릭
                                await utils.click(page, '//button[@ng-click="vm.setVisitAddress()"]');

                                // 주소 선택
                                await utils.click(page, '//a[@ng-click="vm.close(address);"]/p');
                            }
                            else
                            {
                                console.log('방문수령-체크된 상태.');
                            }
                        }

                        // chkQuickService 퀵서비스
                        if(req.body.chkQuickService != undefined)
                        {
                            // 체크박스가 체크됐는지
                            var selectorCheckbox = '//input[@name="quickService"][@class="ng-pristine ng-untouched ng-valid ng-empty"]';
                            if(await utils.isElementExists(page, selectorCheckbox) == true)
                            {
                                console.log('퀵서비스-체크안된 상태.');
                                await utils.click(page, selectorCheckbox);
                            }
                            else
                            {
                                console.log('퀵서비스-체크된 상태.');
                            }
                        }

                        // radIsDeliveryBundle(possible, impossible) 묶음배송여부
                        if(req.body.radIsDeliveryBundle == "impossible")
                            await utils.click(page, '//input[@id="rset_2"]');
                        else
                            await utils.click(page, '//input[@id="rset_1"]');

                        // selDeliveryChargeType(charged, free, conditionalFree, perQuantity, perSectionTwo, perSectionThree) 상품별 배송비
                        // 상품별 배송비 셀렉트 박스 열기

                        // 상품별 배송비 선택
                        switch(req.body.selDeliveryChargeType)
                        {
                            case 'charged' : // 유료
                                await utils.click(page, '//div[@class="selectize-dropdown-content"]/div[@data-value="PAID"]');
                                break;
                            case 'free' : // 무료
                                await utils.click(page, '//div[@class="selectize-dropdown-content"]/div[@data-value="FREE"]');
                                break;
                             case 'conditionalFree' : // 조건별 무료
                                await utils.click(page, '//div[@class="selectize-dropdown-content"]/div[@data-value="CONDITIONAL_FREE"]');
                                break;
                            case 'per_quantity' : // 수량별 무료
                                await utils.click(page, '//div[@class="selectize-dropdown-content"]/div[@data-value="UNIT_QUANTITY_PAID"]');
                                break;
                            case 'per_sectionTwo' : // 구간별(2구간)
                                await utils.click(page, '//div[@class="selectize-dropdown-content"]/div[@data-value="RANGE_QUANTITY_PAID"]');

                                // 2구간 라디오 버튼 클릭
                                await utils.click(page, '//input[@name="isThirdBase"][@value="false"]');
                                break;
                            case 'per_sectionThree' : // 구간별(3구간)
                                await utils.click(page, '//div[@class="selectize-dropdown-content"]/div[@data-value="RANGE_QUANTITY_PAID"]');

                                // 3구간 라디오 버튼 클릭
                                await utils.click(page, '//input[@name="isThirdBase"][@value="true"]');
                                break;
                            default :
                                console.log("배송비 유형 오류");
                                break;
                        }

                        // 배송비 입력
                        if(req.body.selDeliveryChargeType != 'free')
                        {
                            console.log(req.body.selDeliveryChargeType);

                            // 배송비 조건
                            switch(req.body.selDeliveryChargeType)
                            {
                                case 'conditionalFree' :
                                    await utils.clearAndType(page, '//input[@id="delivery_condition"]', '50000');
                                    break;
                                case 'per_quantity' :
                                    await utils.clearAndType(page, '//input[@id="delivery_condition2"]', '5');
                                    break;
                                case 'per_sectionTwo' :
                                    // ~x 까지 추가배송비 없음
                                    await utils.clearAndType(page, '//input[@ncp-message-container="#error-freeSectionLastQuantity"]', '5');

                                    // x 초과 구매 시 추가배송비
                                    await utils.clearAndType(page, '//div[@ng-form="_DELIVERY_FEE"]/div[2]/div[3]/div/div[6]/div/div> div/input', '3000');
                                    break;
                                case 'per_sectionThree' :
                                    // ~x 까지 추가배송비 없음
                                    await utils.clearAndType(page, '//input[@ncp-message-container="#error-freeSectionLastQuantity"]', '5');

                                    // ~x까지 추가배송비
                                   await utils.clearAndType(page, '//input[@ng-model="vm.modelData.deliveryFee.secondSectionLastQuantity"]', '10');

                                    // 추가배송비 금액
                                    await utils.clearAndType(page, '//div[@ng-form="_DELIVERY_FEE"]/div[2]/div[3]/div/div[4]/div/div/div/input', '3000');

                                    // x 초과 구매 시 추가배송비
                                    await utils.clearAndType(page, '//input[@ng-model="vm.modelData.deliveryFee.thirdExtraFee"]', '6000');
                                    break;
                                default :
                                    break;
                            }

                            // 기본 배송비
                            await utils.clearAndType(page, '//input[@id="basic_price"]', '3000'); // 배송비 3000원
                            var strDelivery = await utils.getValue(page, '//input[@id="basic_price"]');
                            //assert.strictEqual('3000', strDelivery);

                            // 결제방식(착불(default), 선결제)
                            if(req.body.chkPaymentAdvance != undefined)
                            {
                                if(req.body.chkPaymentCollect != undefined) // 착불+선결제
                                    await utils.click(page, '//input[@value="COLLECT_OR_PREPAID"]');
                                else // 선결제
                                    await utils.click(page, '//input[@value="PREPAID"]');
                            }
                            else
                                await utils.click(page, '//input[@value="COLLECT"]');

                            // tRegionCharge 지역별 차등 배송비
                            if(req.body.tRegionCharge != undefined)
                            {
                                await utils.clearAndType(page, '//input[@id="delivery_price"]', req.body.tRegionCharge);
                                var strRegionCharge = await utils.getValue(page, '//input[@id="delivery_price"]');
                                assert.strictEqual(req.body.tRegionCharge, strRegionCharge);
                            }

                            // radInstallCosts(exist, none(default)) 별도 설치비
                            if(req.body.radInstallCosts == "exist")
                                await utils.click(page, '//input[@id="install1"]');

                            // 반품/교환 영역 열기
                            await utils.click(page, '//div[@ncp-click="vm.returnDeliveryMenu()"]/div');
                            console.log("반품/교환 on");


                            // 반품배송비(편도)
                            await utils.clearAndType(page, '//input[@id="return_price"]',req.body.nDeliveryChargeReturn);
                            var strReturnPrice = await utils.getValue(page, '//input[@id="return_price"]');
                            assert.strictEqual(req.body.nDeliveryChargeReturn, strReturnPrice);


                            // 교환배송비(왕복)
                            await utils.clearAndType(page, '//input[@id="exchange_price"]',req.body.nDeliveryChargeChange);
                            var strExchangePrice = await utils.getValue(page, '//input[@id="exchange_price"]');
                            assert.strictEqual(req.body.nDeliveryChargeChange, strExchangePrice);
                        }
                    }
                }

                // A/S
                if(req.body.chkAs != undefined)
                {
                    console.log("A/S, 특이사항 on");

                    // A/S 영역 열기
                    await utils.click(page, '//div[@ncp-click="vm.openMenuToggle();"]');

                    // A/S 전화번호
                    await utils.clearAndType(page, '//input[@id="as_number"]',req.body.tAsNumber);
                    var strAsNumber = await utils.getValue(page, '//input[@id="as_number"]');
                    assert.strictEqual(req.body.tAsNumber, strAsNumber);

                    // A/S 안내
                    await utils.clearAndType(page, '//textarea[@id="as_info"]',req.body.tAsDescription);
                    var strAsDescription = await utils.getValue(page, '//textarea[@id="as_info"]');
                    assert.strictEqual(req.body.tAsDescription, strAsDescription);
                }

                // 추가상품
                if(req.body.chkAdditionalProduct != undefined)
                {
                    // 추가상품 영역 열기
                    await utils.click(page, '//div[@server-field-errors="product.detailAttribute.supplementProductInfo.*"]');
                    console.log("추가상품 on");

                    // 추가상품 - 정렬순서
                    console.log(req.body.selAdditionalProductOrder);
                    switch(req.body.selAdditionalProductOrder)
                    {
                        case 'orderRegistr' :
                            await utils.click(page, '//div[@data-value="CREATE"]');
                            break;
                        case 'orderAbc' :
                           await utils.click(page, '//div[@data-value="ABC"]');
                            break;
                         case 'orderLowPrice' :
                            await utils.click(page, '//div[@data-value="LOW_PRICE"]');
                            break;
                        case 'ordeorHighPrice' :
                            await utils.click(page, '//div[@data-value="HIGH_PRICE"]');
                            break;
                        default :
                            console.log("추가상품 정렬순서 오류");
                            break;
                    }

                    console.log(req.body.selAdditionalProductNum);

                    // 추가상품 -  추가상품 개수
                    await utils.click(page, '//div[@data-value="1"][@class="item"]');

                    switch(req.body.selAdditionalProductNum){
                    case '1':
                        // 추가상품 개수 - 1개 선택
                        await utils.click(page, '//div[@ng-show="vm.isConfig"]/div/div/div/div/div/div[2]/ div/div');

                        // 개별 추가상품 입력
                        await utils.type(page, '//input[@id="supple_group_name0"]', '케이스');
                        await utils.type(page, '//input[@id="supple_names0"]', 'RED,BLUE,YELLOW');
                        await utils.type(page, '//input[@id="supple_prices0"]', '0,50,100');
                        break;
                    case '2':
                        // 추가상품 개수 - 2개 선택
                        await utils.click(page, '//div[@ng-show="vm.isConfig"]/div/div/div/div/div/div[2]/ div/div[2]');

                        // 개별 추가상품 입력
                        await utils.type(page, '//input[@id="supple_group_name0"]', '케이스');
                        await utils.type(page, '//input[@id="supple_names0"]', 'RED,BLUE,YELLOW');
                        await utils.type(page, '//input[@id="supple_prices0"]', '0,50,100');
                        await utils.type(page, '//input[@id="supple_group_name1"]', '이어폰');
                        await utils.type(page, '//input[@id="supple_names1"]', 'BLACK,WHITE');
                        await utils.type(page, '//input[@id="supple_prices1"]', '0,50');
                        break;
                    case '3':
                        // 추가상품 개수 - 3개 선택
                        await utils.click(page, '//div[@ng-show="vm.isConfig"]/div/div/div/div/div/div[2]/ div/div[3]');

                        // 개별 추가상품 입력
                        await utils.type(page, '//input[@id="supple_group_name0"]', '케이스');
                        await utils.type(page, '//input[@id="supple_names0"]', 'RED,BLUE,YELLOW');
                        await utils.type(page, '//input[@id="supple_prices0"]', '0,50,100');
                        await utils.type(page, '//input[@id="supple_group_name1"]', '이어폰');
                        await utils.type(page, '//input[@id="supple_names1"]', 'BLACK,WHITE');
                        await utils.type(page, '//input[@id="supple_prices1"]', '0,50');
                        await utils.type(page, '//input[@id="supple_group_name2"]', '마이크');
                        await utils.type(page, '//input[@id="supple_names2"]', 'BLACK,WHITE');
                        await utils.type(page, '//input[@id="supple_prices2"]', '0,50');
                    default:
                        console.log("선택형 옵션 - 개수 error");
                        break;
                    }

                    // [추가상품목록 적용]
                    await utils.click(page, '//a[@ng-click="vm.submitToGrid()"]');

                    // 추가상품 목록 전체 선택
                    await utils.click(page, '//div[@id="center"]/div/div/div/div/div/div[1]/div/label/input');

                    // 개별 추가상품 재고수량 입력 후, 적용
                    await utils.type(page, '//input[@ng-model="vm.bulkStockQuantity"]', '10');
                    await utils.click(page, '//a[@ng-click="vm.modifySelectedRowByBulk()"]');
                 }

                // 구매/혜택조건
                if(req.body.chkBenefitCondition != undefined
                  || req.body.chkBuyCondition != undefined )
                {
                    console.log("구매혜택/조건 on");

                    // 구매혜택/조건 열기
                    await utils.click(page, '//form[@id="productForm"]/ng-include/ui-view[18]/div/div');

                    // nBuyConditionMin 최소구매수량
                    await utils.type(page, '//input[@id="prd_min"]',req.body.nBuyConditionMin);
                    var strBuyConditionMin = await utils.getValue(page, '//input[@id="prd_min"]');
                    assert.strictEqual(req.body.nBuyConditionMin, strBuyConditionMin);

                    // nBuyConditionMaxPer 최대구매수량(1회)
                    console.log('최대구매수량(1회)' + req.body.nBuyConditionMaxPer);
                    await utils.click(page, '//input[@ng-model="vm.viewData.isUseMaxPurchaseQuantityPerOrder"]');
                    await utils.type(page, '//input[@ng-model="vm.product.detailAttribute.purchaseQuantityInfo.maxPurchaseQuantityPerOrder"]', req.body.nBuyConditionMaxPer);
                    var strBuyConditionMaxPer = await utils.getValue(page, '//input[@ng-model="vm.product.detailAttribute.purchaseQuantityInfo.maxPurchaseQuantityPerOrder"]');
                    assert.strictEqual(req.body.nBuyConditionMaxPer, strBuyConditionMaxPer);

                    // nBuyConditionMaxPerson 최대구매수량(1인)
                    console.log('최대구매수량(1인)' + req.body.nBuyConditionMaxPerson);
                    await utils.click(page, '//input[@ng-model="vm.viewData.isUseMaxPurchaseQuantityPerId"]');
                    await utils.type(page, '//input[@ng-model="vm.product.detailAttribute.purchaseQuantityInfo.maxPurchaseQuantityPerId"]', req.body.nBuyConditionMaxPerson);
                    var strBuyConditionMaxPerson = await utils.getValue(page, '//input[@ng-model="vm.product.detailAttribute.purchaseQuantityInfo.maxPurchaseQuantityPerId"]');
                    assert.strictEqual(req.body.nBuyConditionMaxPerson, strBuyConditionMaxPerson);

                    // 상품 구매 시 지급 체크박스 클릭
                    await utils.click(page, '//input[@ng-model="vm.viewData.isUsePurchasePointPolicy"]');

                    // nPointBuy 지급 포인트
                    await utils.type(page, '//div[@id="error_purchasePointPolicy_value"]/div[1]/div/div/input', req.body.nPointBuy);
                    var strPointBuy = await utils.getValue(page, '//div[@id="error_purchasePointPolicy_value"]/div[1]/div/div/input');
                    assert.strictEqual(req.body.nPointBuy, strPointBuy);

                    // selPointBuyType(won, percent) 지급 포인트 단위
                    try{
                        var nIdex = (req.body.selPointBuyType == 'won' ? 2 : 1);
                        console.log(req.body.selPointBuyType);
                        console.log('인덱스 : ' + nIdex);

                        await page.evaluate(({nIdex}) => {
                            document.querySelector('//div[@id="error_purchasePointPolicy_value"]/div[1]/div/div/ul/li[' + nIdex + ']/a').click();
                        }, {nIdex});
                    }
                    catch(error){
                        console.log('click(index) error : ' + error);
                    }

                    // 상품리뷰 작성시 지급 체크박스 클릭
                    await utils.click(page, '//input[@ng-model="vm.viewData.isUseReviewPointPolicy"]');

                    // nPointTextReview 텍스트 리뷰 포인트
                    await utils.clearAndType(page, '//input[@id="prd_textReview"]',req.body.nPointTextReview);
                    var strTextReview = await utils.getValue(page, '//input[@id="prd_textReview"]');
                    assert.strictEqual(req.body.nPointTextReview, strTextReview);

                    // nPointPhotoReview 포토/동영상 리뷰 포인트
                    await utils.clearAndType(page, '//input[@id="prd_photoVideoReview"]', req.body.nPointPhotoReview);
                    var strPhotoVideoReview = await utils.getValue(page, '//input[@id="prd_photoVideoReview"]');
                    assert.strictEqual(req.body.nPointPhotoReview, strPhotoVideoReview);

                    // nPoint1MTextReview 한달사용 텍스트 리뷰 포인트
                    await utils.clearAndType(page, '//input[@id="prd_afterUseTextReview"]', req.body.nPoint1MTextReview);
                    var strAfterTextReview = await utils.getValue(page, '//input[@id="prd_afterUseTextReview"]');
                    assert.strictEqual(req.body.nPoint1MTextReview, strAfterTextReview);

                    // nPoint1MPhotoReview 한달사용 포토/동영상 리뷰 포인트
                    await utils.clearAndType(page, '//input[@id="prd_afterUsePhotoVideoReview"]', req.body.nPoint1MPhotoReview);
                    var strAfterTextPhotoReview = await utils.getValue(page, '//input[@id="prd_afterUsePhotoVideoReview"]');
                    assert.strictEqual(req.body.nPoint1MPhotoReview, strAfterTextPhotoReview);

                    // nPointTokJJim 톡톡친구/스토어찜 고객리뷰 포인트
                    await utils.clearAndType(page, '//input[@id="prd_storeMemberReview"]', req.body.nPointTokJJim);
                    var strTokJJim = await utils.getValue(page, '//input[@id="prd_storeMemberReview"]');
                    assert.strictEqual(req.body.nPointTokJJim, strTokJJim);
                }

                if(!isSmartStore) // 쇼핑윈도 노출 비활성화 시,
                {
                    await utils.click(page, '//input[@data-nclicks-code="ech.sf"]'); // 쇼핑윈도 비활성화
                    console.log('스마트스토어 비활성화');
                }

                if(isShoppingWindow) // 쇼핑윈도 노출 활성화 시, 윈도 채널 선택
                {
                    // 해당 판매자 계정의 쇼핑윈도 목록 저장
                    const arrWindowList = await page.$$eval('//div[@ng-if="vm.viewData.ownerChannelInfoListMap[channelServiceType].length > 1"]/div/div/div[2]/div/div', hrefs => hrefs.map((element) => {
                          return element.innerText
                     }));

                    // 쇼핑윈도 목록과 비교할 문자열 저장
                    var strWindow = undefined;
                    switch(req.body.sProductCategory){
                        case 'department':
                            strWindow = '백화점';
                            break;
                        case 'outlet':
                            strWindow = '아울렛';
                            break;
                        case 'style':
                            strWindow = '스타일';
                            break;
                         case 'designer':
                            strWindow = '디자이너';
                            break;
                         case 'beauty':
                            strWindow = '뷰티';
                            break;
                         case 'living':
                            strWindow = '리빙';
                            break;
                         case 'directfarm':
                            strWindow = '산지직송';
                            break;
                         case 'localfood':
                            strWindow = '지역명물';
                            break;
                         case 'homemeal':
                            strWindow = '쿠킹박스';
                            break;
                         case 'cvs':
                            strWindow = '편의점';
                            break;
                         case 'kids':
                            strWindow = '키즈';
                            break;
                        case 'pet':
                            strWindow = '펫';
                            break;
                        case 'play':
                            strWindow = '플레이';
                            break;
                        case 'art':
                            strWindow = '아트';
                            break;
                        default:
                            break;
                    }

                    console.log(strWindow);

                    var isWindowExists = false;
                    var nWindowIdex = 0;
                    for(var j in arrWindowList)
                    {
                        nWindowIdex++;
                        console.log(j + ' : ' + arrWindowList[j]);

                        var nValue = arrWindowList[j].indexOf(strWindow);

                        if(nValue !== -1) // 윈도 문자열 존재
                        {
                            isWindowExists = true;
                            break;
                        }
                    }

                    if(isWindowExists) // 사용자가 선택한 윈도 유형이 판매자의 윈도 목록에 있을 경우
                    {
                        console.log('nWindowIdex = ' +nWindowIdex);
                        await utils.click(page, '//div[@ng-if="vm.viewData.ownerChannelInfoListMap[channelServiceType].length > 1"]/div/div/div[2]/div/div[' + nWindowIdex + ')');
                        console.log('isWindowExists true');
                    }
                    else // 사용자가 선택한 윈도 유형이 판매자의 윈도 목록에 없을 경우
                    {
                        await utils.click(page, '//input[@data-nclicks-code="ech.swin"]'); // 쇼핑윈도 비활성화
                        console.log('쇼핑윈도 비활성화(isWindowExists false)');
                    }
                }
                else // 쇼핑윈도 노출 미설정 시,
                {
                    await utils.click(page, '//input[@data-nclicks-code="ech.swin"]'); // 쇼핑윈도 비활성화
                    console.log('쇼핑윈도 비활성화');
                }

                // [상품등록]
                console.log('상품등록11111');
                await utils.click(page, '//button[@data-nclicks-code="flt.save"][@progress-button="vm.submit()"]');

                res.send('<script type="text/javascript">alert("상품등록 완료");history.back();</script>');
            }
            catch(error){
                res.send('<script type="text/javascript">alert("상품등록 실패(' + error + ')");history.back();</script>');
                console.log('상품등록 실패 : ' + error);
            }

            //stop coverage trace
            const [jsCoverage, cssCoverage] = await Promise.all([
              page.coverage.stopJSCoverage(),
              page.coverage.stopCSSCoverage(),
            ]);

            let totalBytes = 0;
            let usedBytes = 0;
            const coverage = [...jsCoverage, ...cssCoverage];
            for (const entry of coverage) {
              totalBytes += entry.text.length;
              for (const range of entry.ranges)
                usedBytes += range.end - range.start - 1;
            }

            const usedCode = ((usedBytes / totalBytes)* 100).toFixed(2);
            console.log('Code used by only', usedCode, '%');

            await page.evaluate(() => console.log(`url is ${location.href}`));

            browser.close();
        })();
        //res.send('상품등록중입니다. 잠시만 기다려주세요...');
    });
}
