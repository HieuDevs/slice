# WebRTC – ICE – SDP – STUN – TURN (Complete Technical Notes)

## 1. WebRTC là gì?

WebRTC (Web Real-Time Communication) là một tập hợp các API và protocol cho phép:

* Video call
* Audio call
* Data channel (P2P)

Giữa hai peer **trực tiếp (peer-to-peer)** mà không cần media server (trong case 1-1).

Thành phần chính:

* Media capture
* Encoding/decoding
* NAT traversal
* Signaling (bạn tự implement)
* Security (DTLS, SRTP)

---

## 2. Kiến trúc tổng thể

Signaling server dùng để:

* Exchange SDP
* Exchange ICE candidates

Media KHÔNG đi qua signaling server.

Flow:

1. Create offer
2. SetLocalDescription
3. Send offer qua signaling
4. SetRemoteDescription
5. ICE gathering
6. ICE connectivity checks
7. Connected

---

## 3. SDP (Session Description Protocol)

SDP là bản mô tả session:

Nó chứa:

* Codec
* Media type
* ICE ufrag/pwd
* Fingerprint (DTLS)
* Candidate (optional)

### 3.1 Offer / Answer

Offer:
"Tôi muốn call với cấu hình này"

Answer:
"OK, tôi accept cấu hình này"

---

## 4. ICE (Interactive Connectivity Establishment)

ICE là engine chịu trách nhiệm:

* Thu thập candidates
* Ghép cặp candidates
* Connectivity checks
* Chọn đường tốt nhất

Bạn KHÔNG tự viết logic fallback.

ICE tự làm.

---

## 4.1 Candidate types

### host

IP nội bộ
Ví dụ:
192.168.x.x

### srflx (server reflexive)

Lấy từ STUN
Public IP + port mapping

### relay

Lấy từ TURN
Media đi qua server

---

## 4.2 Priority (ICE chọn theo thứ tự)

1. host
2. srflx
3. relay

---

# 5. STUN

## 5.1 STUN là gì?

STUN giúp peer biết:

* Public IP
* Port mapping

STUN KHÔNG relay media.

Chỉ dùng cho:

* NAT discovery

---

## 5.2 STUN hoạt động thế nào?

Peer gửi request ra STUN → STUN trả về địa chỉ public.

Mapping này gọi là srflx candidate.

---

## 5.3 STUN có đảm bảo P2P không?

KHÔNG

Nó chỉ chứng minh:
Outbound UDP hoạt động.

Không đảm bảo inbound connect được.

---

# 6. TURN

## 6.1 TURN là gì?

TURN là server relay media.

Khi P2P fail:
A → TURN → B

---

## 6.2 TURN dùng khi nào?

Khi gặp:

* Symmetric NAT
* Firewall block UDP
* Corporate network
* CGNAT (4G/5G)
* Public Wi-Fi

---

## 6.3 Nhược điểm

* Tốn bandwidth server
* Tăng latency

---

# 7. NAT và ảnh hưởng tới P2P

## 7.1 Full cone NAT

P2P OK

## 7.2 Restricted NAT

P2P OK với ICE

## 7.3 Port restricted NAT

P2P OK trong nhiều case

## 7.4 Symmetric NAT

P2P FAIL → cần TURN

Mobile network rất hay dùng symmetric NAT.

---

# 8. Vì sao có srflx nhưng vẫn fail?

Các lý do:

### 8.1 Symmetric NAT

Port mapping khác nhau cho mỗi destination.

### 8.2 Endpoint dependent filtering

Chỉ cho inbound từ IP đã gửi outbound.

### 8.3 Firewall block UDP

### 8.4 NAT timeout

Mapping hết hạn quá nhanh.

---

# 9. ICE flow thực tế

1. Gather candidates
2. Exchange candidates
3. Pair candidates
4. Connectivity checks
5. Select best pair

---

# 10. ICE states

* new
* checking
* connected
* completed
* failed
* disconnected
* closed

---

# 11. Khi nào dùng STUN / TURN

## Chỉ STUN đủ khi:

* Cùng LAN
* NAT dễ

## Cần TURN khi:

* Mobile network
* Corporate network
* Public Wi-Fi

---

# 12. Production best practice

Cấu hình:

* 3 STUN servers
* 1+ TURN server

ICE policy:
all (KHÔNG relay only)

---

# 13. Debug connection type

Dùng getStats → selected candidate pair

candidateType:

* host → LAN
* srflx → P2P qua NAT
* relay → TURN

---

# 14. Connection time

P2P:
~1–2s

TURN:
~3–5s

---

# 15. Chiến lược tối ưu chi phí

Không ép relay.

P2P trước → TURN fallback.

---

# 16. Test strategy

## Phase 1 – Local

Không STUN/TURN

## Phase 2 – Internet test

STUN only

## Phase 3 – Production

STUN + TURN

---

# 17. Key takeaways

* ICE mới là thằng kết nối
* STUN chỉ lấy public IP
* TURN relay khi P2P fail
* Có srflx không đảm bảo connect được
* Mobile network → TURN rất quan trọng

---

# 18. Công thức nhớ nhanh

STUN = "Tôi là ai trên internet"
TURN = "Đi qua tôi khi không gặp trực tiếp được"
ICE = "Engine tìm đường kết nối"
SDP = "Bản mô tả cuộc gọi"