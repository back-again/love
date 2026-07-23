import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';

interface TermsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  contentType?: 'terms' | 'privacy';
}

export default function TermsBottomSheet({
  visible,
  onClose,
  contentType = 'terms',
}: TermsBottomSheetProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop Pressable: closes modal on tapping overlay background */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        {/* Bottom Sheet Container */}
        <View style={styles.bottomSheetContainer}>
          {/* Top Drag Handle Pill */}
          <View style={styles.handlePill} />

          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            bounces={true}
            overScrollMode="always"
          >
            {contentType === 'privacy' ? (
              <>
                <Text style={styles.introText}>
                  주식회사 오답연애(이하 "회사")는 「개인정보 보호법」 등 관련 법령을 준수하며, 회원의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보처리방침을 수립·공개합니다.
                </Text>

                <Text style={styles.articleTitle}>1. 개인정보의 수집 및 이용 목적</Text>
                <Text style={styles.articleBody}>
                  회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.{"\n\n"}
                  • 회원 관리: 소셜 로그인(구글, 애플)을 통한 회원 식별 및 가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 부정 이용 방지 및 비인가 사용 방지, 회원 탈퇴 처리{"\n"}
                  • 서비스 제공 및 맞춤형 콘텐츠 추천: 연령별·성별에 따른 통계학적 특성 분석 및 이를 기반으로 한 맞춤형 오답노트/후기 콘텐츠 추천, 참여도 기반 랭킹(Top 1~10) 시스템 운영{"\n"}
                  • 고충 처리 및 서비스 개선: 유저의 문의사항 접수 및 답변 처리, 서비스 피드백 반영, 불량 회원(커뮤니티 가이드라인 위반자)의 신고 및 차단 조치, 시스템 안정성 확보
                </Text>

                <Text style={styles.articleTitle}>2. 수집하는 개인정보의 항목 및 수집 방법</Text>
                <Text style={styles.articleBody}>
                  회원가입 및 서비스 이용 시 수집하는 필수/선택 항목:{"\n"}
                  • 필수 항목: 이메일 주소, 소셜 회원식별자(ID){"\n"}
                  • 선택 항목: 성별, 생년월일 (※ 선택 항목은 입력하지 않더라도 서비스 기본 기능 이용이 가능하나, 성별·연령별 맞춤형 오답 통계 및 콘텐츠 추천 서비스가 제한될 수 있습니다.){"\n\n"}
                  서비스 이용 과정에서 자동으로 생성되어 수집될 수 있는 항목:{"\n"}
                  • 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보, 기기 정보(모델명, OS 버전), 불량 이용 기록{"\n\n"}
                  개인정보 수집 방법:{"\n"}
                  • 구글(Google), 애플(Apple) 소셜 로그인 연동 시 제공받는 정보 시스템을 통한 수집 및 앱 내 회원 정보 입력 화면을 통한 수집
                </Text>

                <Text style={styles.articleTitle}>3. 개인정보의 보유 및 이용 기간</Text>
                <Text style={styles.articleBody}>
                  1. 회사는 법령에 따른 개인정보 보유·이용기간 또는 회원으로부터 개인정보를 수집 시에 동의 받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.{"\n"}
                  2. 회원의 개인정보는 원칙적으로 회원 탈퇴 시 즉시 파기됩니다.{"\n"}
                  3. [중요 - 탈퇴 후 데이터 잔존 정책]:{"\n"}
                  회원이 서비스 이용 중 작성한 '오답노트', '후기', '댓글' 및 'O/X 투표 참여 기록'은 탈퇴 후에도 서비스 내 집단지성 흐름 유지 및 다른 회원들의 서비스 조회를 위해 삭제되지 않고 그대로 유지됩니다.{"\n"}
                  단, 탈퇴 시 회원의 이메일, 성별, 생년월일 등 모든 개인 식별 정보가 완전히 파기되므로, 서버에 남은 오답노트 및 게시물은 작성자를 전혀 유추할 수 없는 '완전한 익명 데이터'로 전환됩니다.
                </Text>

                <Text style={styles.articleTitle}>4. 개인정보의 제3자 제공 및 처리위탁</Text>
                <Text style={styles.articleBody}>
                  1. 회사는 회원의 개인정보를 제1조(개인정보의 수집 및 이용 목적)에서 명시한 범위 내에서만 처리하며, 회원의 사전 동의 없이는 원칙적으로 회원의 개인정보를 외부에 제공하거나 위탁하지 않습니다.{"\n"}
                  2. 다만, 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우 등 예외적인 경우는 제외됩니다.
                </Text>

                <Text style={styles.articleTitle}>5. 정보주체의 권리·의무 및 그 행사방법</Text>
                <Text style={styles.articleBody}>
                  1. 회원은 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.{"\n"}
                  2. 권리 행사는 앱 내 회원정보 설정 화면이나 고객 문의 및 피드백 보내기 기능을 통해 하실 수 있으며, 회사는 이에 대해 지체 없이 조치하겠습니다.{"\n"}
                  3. 단, 회원 탈퇴 완료 후에는 잔존하는 오답노트, 후기, 댓글 등이 '완전한 익명 상태'로 전환되어 회원 본인의 소유임을 증명할 수 없으므로, 해당 게시물에 대한 정정, 삭제, 열람 요구가 원천적으로 불가능합니다. 게시물 삭제를 원하실 경우 반드시 탈퇴 신청 전에 직접 삭제하셔야 합니다.
                </Text>

                <Text style={styles.articleTitle}>6. 개인정보의 파기 절차 및 방법</Text>
                <Text style={styles.articleBody}>
                  회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 필요하지 않게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.{"\n\n"}
                  • 파기절차: 회원이 탈퇴를 신청하거나 보유 기간이 만료된 개인정보는 목적 달성 후 내부 방침 및 관련 법령에 따라 즉시 파기됩니다.{"\n"}
                  • 파기방법: 전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 완전히 삭제하며, 종이 문서에 출력된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.
                </Text>

                <Text style={styles.articleTitle}>7. 개인정보의 안전성 확보 조치</Text>
                <Text style={styles.articleBody}>
                  회사는 회원의 개인정보를 취급함에 있어 분실·도난·유출·변조 또는 훼손되지 않도록 안전성 확보를 위해 다음과 같은 기술적·관리적 대책을 강구하고 있습니다.{"\n\n"}
                  • 해킹 등에 대비한 기술적 대책: 암호화 기술 등을 이용하여 개인정보를 안전하게 전송·저장하고 있으며, 백신 프로그램을 이용하여 컴퓨터 바이러스에 의한 피해를 방지하고 있습니다.{"\n"}
                  • 개인정보 취급 직원의 최소화 및 교육: 개인정보관련 취급 직원은 담당자에 한정시키고 이를 위한 별도의 비밀번호를 부여하여 정기적으로 갱신하고 있으며, 담당자에 대한 수시 교육을 통해 개인정보처리방침의 준수를 강조하고 있습니다.
                </Text>

                <Text style={styles.articleTitle}>8. 익명 활동 및 서비스 이용 주의사항</Text>
                <Text style={styles.articleBody}>
                  1. 본 서비스는 모든 활동이 닉네임 기반의 익명으로 이루어지는 커뮤니티입니다.{"\n"}
                  2. 회사는 시스템적으로 회원의 식별 정보를 타인에게 노출하지 않으나, 회원 본인이 오답노트, 후기, 댓글 등을 작성할 때 본인 또는 타인의 구체적인 신상 정보(이름, 연락처, 학교 명, 특정 직장 명 등)를 기재하여 익명성이 깨지는 경우, 회사는 이에 대한 책임을 지지 않습니다. 게시물 작성 시 개인정보가 노출되지 않도록 각별히 유의하시기 바랍니다.
                </Text>

                <Text style={styles.articleTitle}>9. 개인정보 보호책임자 및 고충처리 부서</Text>
                <Text style={styles.articleBody}>
                  회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 회원의 고충처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.{"\n\n"}
                  개인정보 보호책임자 및 담당부서:{"\n"}
                  • 성명/직책: 대표이사 / 개인정보 보호책임자{"\n"}
                  • 연락처/이메일: support@odaplove.com{"\n"}
                  • 문의 방법: 앱 내 '문의사항 넣기' 또는 '피드백 보내기' 기능 이용
                </Text>

                <Text style={styles.articleTitle}>10. 개인정보처리방침의 변경</Text>
                <Text style={styles.articleBody}>
                  이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 수정이 있을 시에는 변경사항의 시행 7일 전부터 서비스 내 공지사항을 통해 고지할 것입니다.
                </Text>

                <View style={styles.dateContainer}>
                  <Text style={styles.dateText}>공고일자: 2026년 07월 21일</Text>
                  <Text style={styles.dateText}>시행일자: 2026년 07월 21일</Text>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.introText}>
                  본 약관은 오답연애(이하 "서비스")의 이용과 관련하여 회사와 이용자 사이의 권리, 의무 및 책임사항을 규정합니다.
                </Text>

                <Text style={styles.articleTitle}>제1조 목적</Text>
                <Text style={styles.articleBody}>
                  본 약관은 주식회사 오답연애(이하 "회사")가 제공하는 오답연애 어플리케이션 및 관련 제반 서비스(이하 "서비스")의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항을 규정함으로써, 집단지성을 통해 건강하고 성숙한 연애 고민 해결을 돕는 것을 목적으로 합니다.
                </Text>

                <Text style={styles.articleTitle}>제2조 용어의 정의</Text>
                <Text style={styles.articleBody}>
                  본 약관에서 사용하는 용어의 정의는 다음과 같습니다:
                </Text>
                <View style={styles.subItemContainer}>
                  <Text style={styles.subItemText}>
                    1. "오답노트"란 회원이 상대방과의 갈등이나 상황에 대해 다른 회원들의 판단을 구하고자 작성한 질문 형태의 게시물을 말합니다.
                  </Text>
                  <Text style={styles.subItemText}>
                    2. "O/X 투표"란 다른 회원의 오답노트에 대해 자신의 의견(예민한지, 상대방이 잘못한 게 맞는지 등)을 표현하는 직관적인 투표 시스템을 말합니다.
                  </Text>
                  <Text style={styles.subItemText}>
                    3. "후기"란 오답노트 작성 이후 상황의 진전이나 최종 결과(그 뒤에 어떻게 되었는지 등)를 추가로 공유하는 게시물을 말합니다.
                  </Text>
                  <Text style={styles.subItemText}>
                    4. "참여"란 오답노트 및 후기 작성, 댓글 등록, O/X 투표 참여, 댓글 좋아요 클릭 등 서비스 내에서 이루어지는 모든 활동을 의미합니다.
                  </Text>
                  <Text style={styles.subItemText}>
                    5. "랭킹"이란 일정 기간 동안 서비스 내 참여도가 가장 높은 순서대로 상위 10명(Top 1~10)의 회원을 선정하여 보여주는 시스템을 말합니다.
                  </Text>
                </View>

                <Text style={styles.articleTitle}>제3조 약관의 효력 및 변경</Text>
                <Text style={styles.articleBody}>
                  1. 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.{"\n"}
                  2. 회사는 필요한 경우 관련 법령에 위배되지 않는 범위에서 약관을 변경할 수 있으며, 변경된 약관은 적용일자 및 변경사유를 명시하여 적용일 7일 전(회원에게 불리한 변경의 경우 30일 전)부터 서비스 내에 공지합니다.{"\n"}
                  3. 회원이 변경된 약관의 효력 발생일 이후에도 서비스를 계속 이용하는 경우, 변경된 약관에 동의한 것으로 간주합니다.
                </Text>

                <Text style={styles.articleTitle}>제4조 서비스 이용 및 기능의 제공</Text>
                <Text style={styles.articleBody}>
                  1. 회사는 회원에게 다음과 같은 서비스를 제공합니다:{"\n"}
                  • 오답노트 및 후기 작성·조회 기능{"\n"}
                  • O/X 투표 및 댓글 작성, 댓글 좋아요 기능{"\n"}
                  • 피드 외부 공유 기능{"\n"}
                  • 참여도 기반의 랭킹(Top 1~10) 노출 시스템{"\n"}
                  • 고객 문의사항 접수 및 서비스 피드백 보내기 기능{"\n"}
                  • 부적절한 유저·게시물에 대한 신고 및 차단 기능{"\n"}
                  2. 서비스 내 모든 활동은 철저히 익명으로 이루어지며, 회사는 회원의 개인 식별 정보가 서비스 상에 노출되지 않도록 시스템을 운영합니다.{"\n"}
                  3. 서비스의 이용시간은 회사의 기술상 특별한 지장이 없는 한 연중무휴 24시간 운영을 원칙으로 합니다. 다만 시스템 정기 점검, 서버 증설 등 필요한 경우 일시 중단될 수 있으며, 이 경우 사전에 공지합니다.
                </Text>

                <Text style={styles.articleTitle}>제5조 회원가입 및 계정 관리</Text>
                <Text style={styles.articleBody}>
                  1. 회원가입은 이메일 주소 또는 소셜 계정(Google, Apple, 카카오 등) 연동을 통해 가능합니다.{"\n"}
                  2. 회사는 다음 각 호에 해당하는 경우 가입을 거절하거나 사후에 해지할 수 있습니다:{"\n"}
                  • 타인의 명의 또는 계정을 도용한 경우{"\n"}
                  • 허위 정보를 기재하거나 회사가 제시하는 가입 요건을 충족하지 못한 경우{"\n"}
                  • 이전에 서비스 이용 제한 또는 강제 탈퇴 조치를 받은 적이 있는 경우{"\n"}
                  • 기타 관련 법령 또는 선량한 풍속을 저해할 우려가 있는 경우{"\n"}
                  3. 회원은 자신의 계정 및 로그인 정보에 대한 관리 책임을 가지며, 이를 제3자에게 이용하게 해서는 안 됩니다.
                </Text>

                <Text style={styles.articleTitle}>제6조 게시물 및 투표 데이터의 저작권과 활용</Text>
                <Text style={styles.articleBody}>
                  1. 회원이 서비스 내에 작성한 오답노트, 후기, 댓글에 대한 저작권은 회원 본인에게 있습니다. 다만, 익명 서비스 특성상 다른 회원이 이를 조회하거나 서비스 내 제공되는 외부 공유 기능을 통해 피드를 공유하는 것에 동의한 것으로 간주합니다.{"\n"}
                  2. 회원이 참여한 O/X 투표 결과 및 모든 통계 데이터는 회사의 소유로 하며, 회사는 이를 집단지성 데이터셋 구축, 서비스 개선, 콘텐츠 추천 및 마케팅 목적으로 익명화하여 활용할 수 있습니다.
                </Text>

                <Text style={styles.articleTitle}>제7조 개인정보보호 및 철저한 익명성 보장</Text>
                <Text style={styles.articleBody}>
                  1. 서비스는 안전하고 솔직한 소통을 위해 완벽한 익명 활동을 보장합니다. 회사는 법령에서 정한 예외적인 경우를 제외하고는 회원의 식별 정보를 다른 회원이나 제3자에게 공개하지 않습니다.{"\n"}
                  2. 회원은 오답노트, 후기, 댓글 작성 시 본인 또는 전/현 연인 등 특정 개인을 식별할 수 있는 구체적인 신상 정보(이름, 연락처, 직장명, 학교, 거주지 등)를 직접 노출하지 않도록 주의하여야 합니다.{"\n"}
                  3. 회원이 고의 또는 과실로 게시물 내에 식별 가능한 개인정보를 노출하여 발생한 모든 문제에 대해 회사는 책임을 지지 않습니다.
                </Text>

                <Text style={styles.articleTitle}>제8조 회원의 의무 및 커뮤니티 가이드라인</Text>
                <Text style={styles.articleBody}>
                  회원은 건강하고 건설적인 집단지성 커뮤니티 환경을 위해 다음 각 호의 행위를 하여서는 안 됩니다:{"\n"}
                  • 타인을 비방, 모욕하거나 특정인에게 심한 정신적 모멸감을 주는 언행{"\n"}
                  • 특정 개인의 신상 정보(이름, 사진, SNS 계정 등)를 무단으로 노출하거나 유포하는 행위{"\n"}
                  • 음란성, 폭력성, 혐오성 게시물 또는 광고·홍보성 내용을 유포하는 행위{"\n"}
                  • 허위 사실을 유포하여 다른 회원들에게 혼란을 주거나 서비스 운영을 방해하는 행위{"\n"}
                  • 랭킹 시스템(Top 1~10) 진입 또는 특정 목적으로 매크로 등 부정한 방법을 이용하여 O/X 투표, 댓글, 좋아요 등을 조작하는 행위{"\n"}
                  • 기타 관련 법령 또는 약관에 위배되는 행위
                </Text>

                <Text style={styles.articleTitle}>제9조 신고 및 차단 정책</Text>
                <Text style={styles.articleBody}>
                  1. 회사는 안전한 서비스 환경 유지를 위해 [신고] 및 [차단] 기능을 제공합니다.{"\n"}
                  2. 회원은 제8조(회원의 의무)를 위반한 부적절한 오답노트, 후기, 댓글 또는 유저를 신고할 수 있으며, 회사는 이를 가이드라인에 따라 검토 후 신속히 조치합니다.{"\n"}
                  3. 회원은 자신이 보고 싶지 않은 특정 유저의 게시물이나 댓글을 [차단]할 수 있으며, 차단된 유저의 모든 콘텐츠는 해당 회원에게 더 이상 노출되지 않습니다.
                </Text>

                <Text style={styles.articleTitle}>제10조 집단지성 결과의 면책</Text>
                <Text style={styles.articleBody}>
                  1. 서비스 내에서 도출된 O/X 투표 결과, 댓글 의견, 랭킹 정보 등은 회원들의 자발적 참여에 기반한 '주관적이고 참고용인 의견'일 뿐이며, 회사는 이 의견의 객관적 정확성이나 연애 해결책으로서의 완벽성을 보장하지 않습니다.{"\n"}
                  2. 다른 회원들의 의견이나 투표 결과를 바탕으로 내린 최종 판단과 행동에 대한 책임은 회원 본인에게 있습니다.
                </Text>

                <Text style={styles.articleTitle}>제11조 회원 탈퇴 및 데이터 처리 정책</Text>
                <Text style={styles.articleBody}>
                  1. 회원은 언제든지 서비스 내 설정 화면을 통해 회원 탈퇴를 신청할 수 있으며, 회사는 관련 법령이 정하는 바에 따라 이를 즉시 처리합니다.{"\n"}
                  2. 회원이 탈퇴하더라도, 해당 회원이 작성했던 '오답노트', '후기', '댓글', '좋아요 정보' 및 'O/X 투표 참여 기록'은 다른 회원들의 집단지성 활용 서비스 흐름 유지를 위해 삭제되지 않고 서비스 내에 그대로 잔존합니다.{"\n"}
                  3. 탈퇴와 동시에 회원의 계정 정보 및 개인 식별 정보는 시스템에서 모두 완전히 파기되므로, 서비스에 남아있는 오답노트 및 게시물은 작성자를 전혀 추적할 수 없는 '완전한 익명 상태'로 전환됩니다. 따라서 탈퇴 후에는 본인이 작성했던 게시물의 수정이나 삭제가 원천적으로 불가능합니다.
                </Text>

                <Text style={styles.articleTitle}>제12조 서비스 이용 제한 및 영구 제재</Text>
                <Text style={styles.articleBody}>
                  회사는 회원이 본 약관 또는 제8조(회원의 의무)를 위반하는 경우, 사전 통보 없이 단계별로 서비스 이용을 제한할 수 있습니다:{"\n"}
                  • 주의/경고: 가이드라인 위반 소지가 있는 게시물 블라인드 처리 및 주의 조치{"\n"}
                  • 기간 이용 정지: 일정 기간 동안 오답노트/후기/댓글 작성, 투표 참여 또는 로그인 제한{"\n"}
                  • 영구 탈퇴 및 재가입 제한: 타인의 신상을 악의적으로 노출하거나, 시스템 조작(랭킹 어뷰징), 범죄 행위와 연관된 경우 등 중대한 위반 시 즉시 영구 제재
                </Text>

                <Text style={styles.articleTitle}>제13조 면책조항</Text>
                <Text style={styles.articleBody}>
                  1. 회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지, 디도스(DDoS) 공격 등 불가항력적인 사유로 서비스를 제공할 수 없는 경우 책임을 면합니다.{"\n"}
                  2. 서비스 내에서 회원 간에 발생한 분쟁, 갈등, 혹은 게시된 정보를 신뢰함으로써 발생한 회원의 개인적인 손실이나 감정적 피해에 대해 회사는 법적 책임을 지지 않습니다.
                </Text>

                <Text style={styles.articleTitle}>제14조 분쟁 해결 및 관할법원</Text>
                <Text style={styles.articleBody}>
                  1. 회사와 회원 간에 발생한 전자거래 분쟁에 관한 소송은 제소 당시의 회원의 주소에 의하고, 주소가 없는 경우 거소를 관할하는 지방법원의 전속관할로 합니다.{"\n"}
                  2. 만약 주소 또는 거소가 불명확한 경우에는 관련 법령이 정하는 바에 따릅니다.
                </Text>

                <View style={styles.dateContainer}>
                  <Text style={styles.dateText}>공고일자: 2026년 07월 21일</Text>
                  <Text style={styles.dateText}>시행일자: 2026년 07월 21일</Text>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheetContainer: {
    width: '100%',
    height: '80%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
    maxWidth: 450,
    zIndex: 1,
  },
  handlePill: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EBEBEB',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  scrollArea: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  introText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#9C9C9C',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 20,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  articleBody: {
    fontSize: 16,
    lineHeight: 22,
    color: '#9C9C9C',
    letterSpacing: -0.2,
  },
  subItemContainer: {
    marginTop: 4,
    gap: 8,
  },
  subItemText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#9C9C9C',
    paddingLeft: 4,
    letterSpacing: -0.2,
  },
  dateContainer: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
    gap: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#9C9C9C',
  },
});
