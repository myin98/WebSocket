$(document).ready(() => {
	const host = "http://192.168.0.74:8080";
	var list = [];
	const renderEvent = (data) => {
		list = data;
		$("#list").empty();
		$.each(data, (index, item) => {
			let html = `<a class="list-group-item m-1 ${item.accept? 'bg-success' : 'bg-warning'} display-6" no="${item.no}">${item.title}</a>`;
			$("#list").prepend(html);
		});
		detailEvent();
		socket();
		
	}
	const errorEvent = (data) => console.log(data);
	const detailEvent = () => {
			$("#list > a").on("click", (e) => {
				if(localStorage.getItem("userNm") != null){
				e.preventDefault();
				//var index = $("#list > a").index(e.target);
				var no = $(e.target).attr("no");
				location.href = "/v2/detail.html#" + no;
			} else {
				console.log("로그인 정보가 없습니다");
				alert("로그인 정보가 없습니다.");
			}
			});
		
	}
	const getData = (url) => {
		$.post(url).done(renderEvent).fail(errorEvent);
	}
	$("#nav > a").on("click", (e)=> {

		e.preventDefault();
		var index = $("#nav > a").index(e.target);
		switch(index) {
			case 1:
				getData(host+"/v2/findList/1");
				break;
			case 2:
				getData(host+"/v2/findList/0");
				break;
			case 3:
				location.href = "/v2/new.html";
				break;
			default:
				getData(host+"/v2/findList");
				break;
		}
	});
	const socket = () => {
        const socket = new SockJS("http://localhost:8080/ws-app");
        const client = Stomp.over(socket);
        // client.debug = () => {};
        client.connect({},
            () => {
                console.log("접속 성공");
                client.subscribe("/topic/accept", res => {
                    console.log(res);
                    var msg = JSON.parse(res.body);
                    console.log(msg);
                    $("#list a").each((i, e) => {
                        if ($(e).attr("no") == msg.no) {
                            if (msg.accept) {
                                $(e).addClass("bg-success");
                                $(e).removeClass("bg-warning");
                            } else {
                                $(e).addClass("bg-warning");
                                $(e).removeClass("bg-success");
                            }
                        }
                    });
                })
            },
            res => console.log(res)
        );
    }

	
   // 모달 방식 로그인 이벤트
   $(document).ready(function() {
	// 모달 열기
	$(".server").on("click", function() {
		$('#myModal').modal('show');
	});

	// 모달 닫기 버튼 클릭 시
	$("#close").on("click", function() {
		$('#myModal').modal('hide');
	});

	// 모달 외부 클릭 시
	$(window).on('click', function(event) {
		if ($(event.target).is('#myModal')) {
			$('#myModal').modal('hide');
		}
	});

	// 로그인 폼 제출 시
	$("form#loginForm").on("submit", function(e) {
		e.preventDefault();
		localStorage.setItem("userNm", $("#userNm").val());
		$('#myModal').modal('hide');
	});
});

	


	getData(host+"/v2/findList");
});