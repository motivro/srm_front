$(document).ready(function(){
    const $table = $('#table');
    const $tbody = $table.find('tbody');
    const noColumnIndex = 0;

    // 초기 데이터를 "NO" 열 기준으로 배열에 저장하여 고정
    saveNoData();

    $('.sort_col').on('click', function () {
        const columnIndex = $(this).parent().index();
        const isAscending = $(this).hasClass('sort_up');

        if (columnIndex !== noColumnIndex) {
            // "NO" 열을 제외한 다른 열을 클릭한 경우에만 정렬
            sortTableByColumn(columnIndex, isAscending);

            // 다른 sort_col을 클릭했을 때 이전에 눌렀던 sort_col에서 클래스 제거
            $('.sort_col').not(this).removeClass('sort_up sort_down');
        }

        // 정렬 방식을 토글
        $(this).toggleClass('sort_up', !isAscending);
        $(this).toggleClass('sort_down', isAscending);

        // "NO" 열의 숫자를 다시 적절한 순서로 넣기
        setNoData();
    });

    function saveNoData() {
        // "NO" 열의 데이터를 배열에 저장
        const rows = $tbody.find('tr');
        rows.each(function (index, row) {
            const $noCell = $(row).find('td').eq(noColumnIndex);
            const noValue = parseInt($noCell.text().trim(), 10);
            $noCell.data('originalValue', noValue);
        });
    }

    function setNoData() {
        const rows = $tbody.find('tr');
        rows.each(function (index, row) {
            const $noCell = $(row).find('td').eq(noColumnIndex);
            const originalValue = $noCell.data('originalValue');
            $noCell.text(index + 1); // 1, 2, 3, ... 순서로 넣기
        });
    }

    $(".mt_tbl .graph .progress").each(function (index) {
        const bar = $(this).find(".bar");
        const percent = $(this).find(".percent");
        const width = barWidthArray[index];
        bar.css("width", width + "%");
        percent.text(width.toFixed(0) + "%");
    });
    
    // function sortTableByColumn(columnIndex, isAscending) {
    //     // 헤더에서 클릭한 열의 데이터 값을 기준으로 정렬
    //     const rows = $tbody.find('tr').get();
    //     rows.sort(function (a, b) {
    //         const aValue = $(a).find('td').eq(columnIndex).text().trim();
    //         const bValue = $(b).find('td').eq(columnIndex).text().trim();

    //         if (columnIndex === noColumnIndex) {
    //             // "NO" 열은 미리 저장된 순서를 기준으로 비교하여 고정
    //             return a.rowIndex - b.rowIndex;
    //         } else {
    //             // 그 외 열은 데이터 유형에 따라 비교
    //             if (isAscending) {
    //                 return compareValues(aValue, bValue);
    //             } else {
    //                 return compareValues(bValue, aValue);
    //             }
    //         }
    //     });

    //     // 정렬된 결과를 다시 테이블에 적용
    //     $tbody.empty();
    //     $.each(rows, function (index, row) {
    //         $tbody.append(row);
    //     });
    // }


    function compareValues(a, b) {
        const aValueIsNumber = !isNaN(a);
        const bValueIsNumber = !isNaN(b);
    
        if (aValueIsNumber && bValueIsNumber) {
            const aFloat = parseFloat(a);
            const bFloat = parseFloat(b);
            return aFloat - bFloat;
        } else if (aValueIsNumber && !bValueIsNumber) {
            return -1;
        } else if (!aValueIsNumber && bValueIsNumber) {
            return 1;
        } else {
            // 한글 형식인지 확인
            const koreanFormatRegex = /^(\d+)조$/;
            const aMatch = a.match(koreanFormatRegex);
            const bMatch = b.match(koreanFormatRegex);
    
            if (aMatch && bMatch) {
                return parseInt(aMatch[1], 10) - parseInt(bMatch[1], 10);
            } else {
                return a.localeCompare(b, 'ko', { sensitivity: 'base' });
            }
        }
    }
    
    function sortTableByColumn(columnIndex, isAscending) {
        const rows = $tbody.find('tr').get();
        rows.sort(function (a, b) {
            const aValue = $(a).find('td').eq(columnIndex).text().trim();
            const bValue = $(b).find('td').eq(columnIndex).text().trim();
            
            if (isAscending) {
                return compareValues(aValue, bValue);
            } else {
                return compareValues(bValue, aValue);
            }
        });
    
        // 정렬된 결과를 다시 테이블에 적용
        $tbody.empty();
        $.each(rows, function (index, row) {
            $tbody.append(row);
        });
    }


    // function compareValues(a, b) {
    //     // 숫자와 한글 혼합된 값 처리
    //     const aValueIsNumber = !isNaN(a);
    //     const bValueIsNumber = !isNaN(b);

    //     if (aValueIsNumber && bValueIsNumber) {
    //         return parseInt(a, 10) - parseInt(b, 10);
    //     } else if (aValueIsNumber && !bValueIsNumber) {
    //         return -1; // a는 숫자, b는 숫자가 아니므로 a를 더 앞으로 보냄
    //     } else if (!aValueIsNumber && bValueIsNumber) {
    //         return 1; // b는 숫자, a는 숫자가 아니므로 b를 더 앞으로 보냄
    //     } else {
    //         // 한글 형식인지 확인
    //         const koreanFormatRegex = /^(\d+)조$/;
    //         const aMatch = a.match(koreanFormatRegex);
    //         const bMatch = b.match(koreanFormatRegex);

    //         if (aMatch && bMatch) {
    //             return parseInt(aMatch[1], 10) - parseInt(bMatch[1], 10);
    //         } else {
    //             // 문자열, 한글 등 문자 비교
    //             return a.localeCompare(b, 'ko', { sensitivity: 'base' });
    //         }
    //     }
    // }

// function isTimeFormat(value) {
//     // 시간 형식인지 확인 (예: 01:23:45)
//     const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;
//     return timeRegex.test(value);
// }

// function convertTimeToSeconds(time) {
//     // 시간을 초로 변환 (예: 01:23:45 -> 5025)
//     const [hours, minutes, seconds] = time.split(':').map(Number);
//     return hours * 3600 + minutes * 60 + seconds;
// }

    var body = $('body');
    var hamBtn = $('#ham_btn');
    var navMenu = $('#nav');
    var navClose = $('#nav_close');

    // 유저 메뉴 open이벤트
    $('#user_menu_btn').on("click", function(e){
        var memberZone = $(this).closest('.member_zone');
        var windowWidth = $(window).width();

        if(memberZone.hasClass('open')){
            memberZone.removeClass('open');
            memberZone.addClass('close');
            if (windowWidth < 1156) {
                body.removeClass('no-scroll');
            }
        }else{
            memberZone.removeClass('close');
            memberZone.addClass('open');
            if (windowWidth < 1156) {
                body.addClass('no-scroll');
            }
        }

        e.stopPropagation();
    });

    //////// sdfun ////////
    $('.btn_refresh').on('click', function() {
        // 버튼을 클릭하여 active_rot 클래스를 추가합니다.
        $(this).addClass('active_rot');
    
        // 2초 후에 active_rot 클래스를 제거합니다.
        setTimeout(function() {
            $('.btn_refresh').removeClass('active_rot');
        }, 2000);
    });

    $(".rating_item").on("click", function () {
        // 모든 rating_item에서 "active" 클래스 제거
        $(".rating_item").removeClass("active");

        // 클릭한 rating_item에만 "active" 클래스 추가
        $(this).addClass("active");
    });

    $(".add_good").on("click", function () {
        if($(this).hasClass('active')){
            $(this).removeClass("active");
        } else {
            $(this).addClass("active");
        }
    });
    
     //////// sdfun ////////

    //모바일 navi open 이벤트
    $(hamBtn).on("click", function(e){
        if(navMenu.hasClass('open')){
            navMenu.removeClass('open');
            navMenu.addClass('close');
            body.removeClass('no-scroll');
        }else{
            navMenu.addClass('open');
            navMenu.removeClass('close');
            body.addClass('no-scroll');
        }
        e.stopPropagation();
    });
    // 모바일 navi close 이벤트
    $(navClose).on("click", function(){
        if(navMenu.hasClass('open')){
            navMenu.removeClass('open');
            navMenu.addClass('close');
            body.removeClass('no-scroll');
        }else{
            navMenu.addClass('open');
            navMenu.removeClass('close');
            body.addClass('no-scroll');
        }
    });
    accordion();

    setScreenSize();
    window.addEventListener('resize', setScreenSize);
    
    $(document).on('click', closeUsrMenu);
    $(document).on('click', closeNavMenu);
    // $(document).on('click', closeSelectMenu);

   // 탭영역 active된 item에 focus
    tabScrollerPosition();

    $('.drop_btn').click(function(e) {
        var dropMenu = $(this).siblings('.drop_menu');
        var dropBox = $(this).closest('.drop_box');
    
        if (dropMenu.hasClass('open')) {
            hideDropMenu(dropMenu, dropBox);
        } else {
            showDropMenu(dropMenu, dropBox);
        }
        e.stopPropagation();
    });
    
    $('.drop_item a').click(function(e) {
        e.preventDefault();
        var itemName = $(this).text();
        var dropBox = $(this).closest('.drop_box');
        var btnTxt = dropBox.find('.btn_txt');
    
        hideDropMenu(dropBox.find('.drop_menu'), dropBox);
    });
    
    $('.drop_close_btn').on('click', function(){
        var dropBox = $(this).closest('.drop_box');
        var dropMenu = $(this).closest('.drop_menu');
    
        if (dropBox.hasClass('open')) {
            dropMenu.removeClass('open');
            dropBox.removeClass('open');
        } else {
            dropMenu.addClass('open');
            dropBox.addClass('open');
        }
    });
    
    $(document).click(function(e) {
        var target = $(e.target);
        var dropBox = $('.drop_box');
        var dropMenu = dropBox.find('.drop_menu');
    
        if (!target.closest('.drop_list').length) {
            hideDropMenu(dropMenu, dropBox);
        }
    });

});

// 높이값 설정 관련 쿼리
setScreenSize = () => {
    let vh = window.innerHeight * 0.01;
    let hdHeight = $('#header').outerHeight();
    let ftHeight = $('#footer').outerHeight();
    let fullHeight = ((vh*100) - (hdHeight + ftHeight));
    let vw = window.innerWidth * 0.01;
    let landFullHeight = ((vw*100) - (hdHeight + ftHeight));
    let contentTop = $('.content_top').outerHeight();
    let wrkTopHeight = $('.workspace_wrap .content_top').height();
    let pfLnbHeight = ($('#lnb').outerHeight()) - wrkTopHeight;
    let contentHeight = ((vh*100) - (hdHeight + ftHeight + contentTop));
    let newWrkHeight = (contentHeight + (pfLnbHeight - contentHeight)) + 50;
    
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--hdHeight', `${hdHeight}px`);
    document.documentElement.style.setProperty('--ftHeight', `${ftHeight}px`);
    document.documentElement.style.setProperty('--fullHeight', `${fullHeight}px`);
    document.documentElement.style.setProperty('--landHeight', `${landFullHeight}px`);
    document.documentElement.style.setProperty('--contentHeight', `${contentHeight}px`);
    document.documentElement.style.setProperty('--pfLnbHeight', `${pfLnbHeight}px`);
    document.documentElement.style.setProperty('--wrkTopHeight', `${wrkTopHeight}px`);

    if(contentHeight < pfLnbHeight){
        document.documentElement.style.setProperty('--contentHeight', `${newWrkHeight}px`);
    }
}

// 아코디언 메뉴
accordion = () => {
    $('.acc_wrap').each(function(){
        var acc_btn = $(this).find('.acc_tit');

        acc_btn.click(function() {
            var acc_box = $(this).parent('.acc_box');
            var acc_cont = acc_box.children('.acc_cont');

            if (acc_box.hasClass("open")) {
                acc_box.removeClass("open");
                acc_cont.slideUp(400);
            } else {
                acc_box.addClass("open");
                acc_cont.slideDown(400);

                var otherAccBoxes = $(this).closest('.acc_wrap').siblings('.acc_wrap').find('.acc_box');
                otherAccBoxes.removeClass("open");
                otherAccBoxes.children('.acc_cont').slideUp(400);
            }
            return false;
        });

        var openAccBox = $(this).find('.acc_box.open');
        if (!openAccBox.length > 0) {
            openAccBox.children('.acc_cont').hide();
        }else{
            openAccBox.children('.acc_cont').show();
        }
    });
};

/* 셀렉트 박스 */
var selectUi = {
    class : 'select_wrap',
    seData : [],
    init :() => {
        $.each( $('.'+selectUi.class+''), (index, item) => {
            var seObjData = new Object();
            seObjData.optData = new Array();
            seObjData.seNum = index;
            seObjData.actNum = '';
            seObjData.actVal = '';
            seObjData.actSta = false;
            var seTarget = $('.'+selectUi.class+'').eq(index).children('select');
            $.each( seTarget.children("option"), (seIndex, seItem) => {
                if(seTarget.children("option").eq(seIndex).attr('selected') != undefined){
                    seObjData.actSta = true;
                    seObjData.actNum = seIndex;
                    seObjData.actVal = seItem.text;
                }
                seObjData.optData.push(seItem.text);
            });
            selectUi.seData.push(seObjData);
        })
        selectUi.customSelect();
    },

    customSelect: () => {
        $.each( selectUi.seData, (index, item) => {
            var selectHtml = '';
            var selectTname = item.actVal ? item.actVal : item.optData[0];
            selectHtml+= '<div class="select_box" onclick="selectUi.boxOpen($(this))">';
            selectHtml+= '  <div class="select_btn"><div class="select_name">'+selectTname+'</div><i class="icon arrow arrow_d"></i></div>';
            selectHtml+= '  <div class="opt_list">';
            $.each( item.optData, (seindex, seitem) => {
                selectHtml+= '<div class="opt_item" optnum="'+seindex+'" onclick="selectUi.optionClick($(this))">'+seitem+'</div>';
            });
            selectHtml+= '  </div>';
            selectHtml+= '</div>';
            $('.'+selectUi.class+'').eq(item.seNum).append(selectHtml);
        });
    },

    boxOpen : (obj) =>{
        if(!obj.hasClass('active')) $('.select_box.active').removeClass('active');
        if(obj.hasClass('active')){
            obj.removeClass('active');
        }else{
            obj.addClass('active');
        }
    },

    optionClick: (obj) => {
        obj.closest('.select_box').find('.select_name').text(obj.text());
        obj.closest('.select_wrap').children('select').children("option").eq(obj.attr('optnum')).prop('selected', 'selected');
    },
    
}

var selectUi2 = {
    class : 'select_wrap',
    seData : [],
    init :() => {
        $.each( $('.'+selectUi2.class+''), (index, item) => {
            var seObjData = new Object();
            seObjData.optData = new Array();
            seObjData.seNum = index;
            seObjData.actNum = '';
            seObjData.actVal = '';
            seObjData.actSta = false;
            var seTarget = $('.'+selectUi2.class+'').eq(index).children('select');
            $.each( seTarget.children("option"), (seIndex, seItem) => {
                if(seTarget.children("option").eq(seIndex).attr('selected') != undefined){
                    seObjData.actSta = true;
                    seObjData.actNum = seIndex;
                    seObjData.actVal = seItem.text;
                }
                seObjData.optData.push(seItem.text);
            });
            selectUi2.seData.push(seObjData);
        })
        selectUi2.customSelect();
    },

    customSelect: () => {
        $.each( selectUi2.seData, (index, item) => {
            var selectHtml = '';
            var selectTname = item.actVal ? item.actVal : item.optData[0];
            selectHtml+= '<div class="select_box" onclick="selectUi2.boxOpen($(this))">';
            selectHtml+= '  <div class="select_btn"><div class="select_name">'+selectTname+'</div><i class="icon arrow arrow_d"></i></div>';
            selectHtml+= '  <div class="opt_list">';
            $.each( item.optData, (seindex, seitem) => {
                selectHtml+= '<div class="opt_item" optnum="'+seindex+'" onclick="selectUi2.optionClick($(this))">'+seitem+'</div>';
            });
            selectHtml+= '  </div>';
            selectHtml+= '</div>';
            $('.'+selectUi2.class+'').eq(item.seNum).append(selectHtml);
        });
    },

    boxOpen : (obj) =>{
        if(!obj.hasClass('active')) $('.select_box.active').removeClass('active');
        if(obj.hasClass('active')){
            obj.removeClass('active');
        }else{
            obj.addClass('active');
        }
    },

    optionClick: (obj) => {
        var selectedValue = obj.text();
        obj.closest('.select_box').find('.select_name').text(selectedValue);
        // 선택된 값이 "[M4-1-2]조별 주관식 문제 풀이"인 경우 페이지 이동을 수행합니다.
        if (selectedValue === '[M4-1-2]조별 주관식 문제 풀이') {
            // 페이지 이동을 수행합니다.
            window.location.href = 'work_result_2_1.html'; // 해당 링크 주소를 입력하세요.
        }
        // 선택된 옵션을 실제 select 요소에도 반영합니다.
        obj.closest('.select_wrap').children('select').children("option").eq(obj.attr('optnum')).prop('selected', 'selected');
    }
    
}




function closeUsrMenu(e) {
    var clickedInsideUsrMenu = $(e.target).closest('.user_menu').length > 0;
    if($('.member_zone').hasClass('open')){
        if (!clickedInsideUsrMenu) {
            $('body').removeClass('no-scroll');
            $('.member_zone').removeClass('open');
            $('.member_zone').addClass('close');
        }
    }
}
function closeNavMenu(e) {
    var clickedInsideUsrMenu = $(e.target).closest('.nav_inner').length > 0;
    if($('#nav').hasClass('open')){
        if (!clickedInsideUsrMenu) {
            $('body').removeClass('no-scroll');
            $('#nav').removeClass('open');
            $('#nav').addClass('close');
        }
    }
}
function closeSelectMenu(e) {
    var clickedInsideSelectMenu = $(e.target).closest('.opt_list').length > 0;
    if($('.select_box').hasClass('active')){
        if (!clickedInsideSelectMenu) {
            $('.select_box').removeClass('active');
        }
    }
}

// overflow 탭고정
function tabScrollerPosition() {
    $('.tab_list').each(function() {
        var $li = $(this).find('.tab_item');
        var idx, gap;
        $li.each(function(i) {
            if($(this).hasClass('selected')) idx = i;
            return idx;
        });
        var posX = $li.eq(idx).offset().left;
        var $wrap = $li.closest('.tab_list');
        $wrap.scrollLeft(posX);
    });
}

// 레이어팝업 관련 쿼리
function openPopup(popupId) {

    if(popupId == 'sample1'){
        document.dispatchEvent(popupEvent);
    }

    if(popupId == 'sample2'){
        document.dispatchEvent(popupEvent);
    }
    
    var popup = $('#' + popupId);
    var dim = $('#lyDim');
    var body = $('body');

    if (popup.hasClass('open')) {
        hidePopup(popup);
        body.removeClass('no-scroll');
        if (dim.hasClass('show')) {
            hidePopup(dim);
        }
    } else {
        showPopup(popup);
        showPopup(dim);
        body.addClass('no-scroll');
    }
}
function closePopup(popupId) {
    var popup = $('#' + popupId);
    var dim = $('#lyDim');
    var body = $('body');

    if (popup.hasClass('open')) {
        hidePopup(popup);
        body.removeClass('no-scroll');
        if ($('.popup.open').length === 0) {
            hidePopup(dim);
        }
    }
}
function showPopup(element) {
    element.fadeIn(180).addClass('open');
}
function hidePopup(element) {
    element.fadeOut(180, function() {
        $(this).removeClass('open');
    });
}
function closePopupOnDimClick() {
    var dim = $('#lyDim');
    var openPopups = $('.ly_pop.open');
    var body = $('body');

    if (openPopups.length >= 0) {
        hidePopup(openPopups);
        hidePopup(dim);
        body.removeClass('no-scroll');
    }
}

// 토스트 알럿
toast = (string, location) => {
    /* 토스트메세지 바디를 생성합니다. */
    if($('.idt_toast').length == 0 ) $('body').append('<div class="idt_toast"><div class="toast_hd"><div class="tit">알림</div><div class="toast_close" onclick="toastClose($(this))"><span class="sound_only">닫기</span><i class="icon close"></i></div></div><div class="toast_bd">'+string+'</div></div>');

    if(location != undefined){
        $('.idt_toast').addClass('center');
    }

    setTimeout( function() {
        const toast = $('.idt_toast');
        toast.addClass('reveal');
        // var toasts = setTimeout( function() {
        //     toast.removeClass('reveal');
        //     clearTimeout(toasts);
        // }, 1500);
    }, 10);
}
toastClose = (obj) =>{
    console.log(123)
    obj.closest('.idt_toast').removeClass('reveal')
}

// 드롭박스
function showDropMenu(dropMenu, dropBox) {
    dropMenu.addClass('open');
    dropBox.addClass('open');
}

function hideDropMenu(dropMenu, dropBox) {
    dropMenu.removeClass('open');
    dropBox.removeClass('open');
}
