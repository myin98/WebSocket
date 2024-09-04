$(document).ready(() => {
    const server = "http://192.168.0.8:8080/ws-app";
    // const client = Stomp.over(socket);
    var client = null;
    const prefixes = "/msg/set"
    const topic = "/topic/get"
    var message = null;
    var time = null;
    var userNm = null;
    // 커넥션이 성공했을때 콜백 함수

    class ResultData {
        constructor(message, time, userNm) {
            this.message = message;
            this.time = time;
            this.userNm = userNm;
        }
    };

    // class User {
    //     constructor(userNm) {
    //         this.userNm = userNm;
    //     }
    // }

    const EVENT5 = () => {
        client = Stomp.over(new SockJS(server));
        client.connect({}, EVENT1, EVENT2);
    }

    const EVENT1 = () => {
        console.log("접속 성공");
        client.subscribe(topic, EVENT4);
    };
    // 커넥션이 실패 했을때 콜백 함수
    const EVENT2 = () => console.log("접속 실패");


    const EVENT4 = msg => DRAW(JSON.parse(msg.body));

    // 소켓 접속이 성공하고 난 후에 동작해야 하는 메세지 전송 기능.
    const EVENT3 = (data) => {
        // console.log(client);
        if(client.connected){
            client.send(prefixes, {}, JSON.stringify(data));
        } else {
            alert("소켓 정보 없당.");
        }
    };

    const DRAW = (msg) => {
        let messagePosition = isValidUse(msg.userNm) ? 'message-right' : 'message-left';
        let messageContentPosition = isValidUse(msg.userNm) ? 'message-content-right' : 'message-content-left';
        let messageTimePosition = isValidUse(msg.userNm) ? 'message-right' : 'message-left';
        let html = `<div class="message ${messagePosition}">
                <h3 class="message-user">${msg.userNm}</h3>
                <div class="message-body">
                    <p class="message-content ${messageContentPosition}">${msg.message}</p>
                    <p class="message-time ${messageTimePosition}">${msg.time}</p>
                </div>
            </div>`;
        $(".messages").append(html);
        $(".messages").scrollTop($(".messages")[0].scrollHeight);
    }

    $("form#messageForm").on("submit", e => {
        e.preventDefault();
        if (localStorage.getItem("userNm") == null) {
            $("#message").val("");
            $("#modal").toggle();
            return;
        }

        var data = new ResultData($("#message").val(),"" ,localStorage.getItem("userNm"));
        // console.log(message);
        $("#message").val("");
        EVENT3(data);
    });

    $("#btn2").on("click", () => {
        EVENT5();
    });

    const isValidUse = (userNm) => {
        return userNm == localStorage.getItem("userNm");
    };

    // 모달 방식 로그인 이벤트
    $(".server").on("click", () => {
        $('#modal').toggle();
    });
    $("#close").on("click", () => $('#modal').hide());

    $(window).on('click', function (event) {
        if ($(event.target).is('#modal')) {
            $('#modal').hide();
        }
    });

    $("form#loginForm").on("submit", e => {
        e.preventDefault();
        localStorage.setItem("userNm", $("#username").val());
        $('#modal').hide();
    });
});