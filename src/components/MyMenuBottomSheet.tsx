import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Pressable,
  Platform,
  Alert,
  Switch,
  KeyboardAvoidingView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

export type MyMenuType = 'feedback' | 'inquiry' | 'terms' | 'privacy' | 'settings' | 'settings_hub' | 'write_review' | 'view_review' | null;

interface MyMenuBottomSheetProps {
  visible: boolean;
  menuType: MyMenuType;
  onClose: () => void;
  userEmail?: string;
  onLogout?: () => void;
}

export default function MyMenuBottomSheet({
  visible,
  menuType,
  onClose,
  userEmail = 'asdf1234@kakao.com',
  onLogout,
}: MyMenuBottomSheetProps) {
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isFeedbackInputFocused, setIsFeedbackInputFocused] = useState(false);
  const [activeSubView, setActiveSubView] = useState<'terms' | 'privacy' | 'settings' | null>(null);

  // Settings State
  const [pushNoti, setPushNoti] = useState(true);
  const [marketingNoti, setMarketingNoti] = useState(false);

  if (!menuType) return null;

  const currentView = menuType === 'settings_hub' && activeSubView ? activeSubView : menuType;

  const handleClose = () => {
    setActiveSubView(null);
    onClose();
  };

  const handleSendFeedback = () => {
    if (!feedbackText.trim()) {
      if (Platform.OS === 'web') alert('피드백 내용을 입력해주세요.');
      else Alert.alert('안내', '피드백 내용을 입력해주세요.');
      return;
    }
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedbackText('');
      handleClose();
      if (Platform.OS === 'web') alert('소중한 피드백이 전달되었습니다! 감사합니다.');
      else Alert.alert('완료', '소중한 피드백이 전달되었습니다! 감사합니다.');
    }, 600);
  };

  const getTitle = () => {
    switch (currentView) {
      case 'feedback':
        return '피드백 보내기';
      case 'inquiry':
        return '문의 사항';
      case 'terms':
        return '오답연애 서비스 이용약관';
      case 'privacy':
        return '오답연애 개인정보 처리방침';
      case 'settings':
        return '계정 설정';
      case 'settings_hub':
        return '설정';
      case 'write_review':
        return '후기 남기기';
      case 'view_review':
        return '사연 후기';
      default:
        return '';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop Pressable */}
        <Pressable style={styles.backdrop} onPress={handleClose} />

        {/* Keyboard Avoiding Container for Textarea input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingView}
        >
          {/* Bottom Sheet Modal Container */}
          <View style={styles.bottomSheetContainer}>
            {/* Top Handle Pill */}
            <View style={styles.handlePill} />

            {/* Header Row */}
            <View style={styles.headerRow}>
              <View style={styles.headerLeftRow}>
                {menuType === 'settings_hub' && activeSubView && (
                  <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => setActiveSubView(null)}
                    activeOpacity={0.7}
                  >
                    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M15 18l-6-6 6-6"
                        stroke="#0F172A"
                        strokeWidth={2.2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </TouchableOpacity>
                )}
                <Text style={styles.sheetTitle}>{getTitle()}</Text>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={handleClose} activeOpacity={0.7}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="#9C9C9C"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </TouchableOpacity>
            </View>

            {/* Body Content by Menu Type */}
            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* 0. 설정 허브 (Settings Hub - 상단 톱니바퀴 클릭 시) */}
              {currentView === 'settings_hub' && (
                <View style={styles.contentSection}>
                  <TouchableOpacity
                    style={styles.hubMenuItem}
                    onPress={() => setActiveSubView('terms')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.hubMenuText}>이용 약관</Text>
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                      <Path d="M9 18l6-6-6-6" stroke="#9C9C9C" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.hubMenuItem}
                    onPress={() => setActiveSubView('privacy')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.hubMenuText}>개인정보처리방침</Text>
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                      <Path d="M9 18l6-6-6-6" stroke="#9C9C9C" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.hubMenuItem, { borderBottomWidth: 0 }]}
                    onPress={() => setActiveSubView('settings')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.hubMenuText}>계정 설정</Text>
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                      <Path d="M9 18l6-6-6-6" stroke="#9C9C9C" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </TouchableOpacity>
                </View>
              )}

              {/* 1. 피드백 보내기 */}
              {currentView === 'feedback' && (
                <View style={styles.contentSection}>
                  <Text style={styles.sectionDesc}>
                    연애오답을 이용하시면서 느끼신 개선점이나 아이디어가 있다면 편하게 남겨주세요. 개발팀이 하나하나 소중히 검토합니다!
                  </Text>
                  <TextInput
                    style={styles.feedbackInput}
                    placeholder="서비스 개선을 위한 의견을 자유롭게 적어주세요."
                    placeholderTextColor="#BCBCBC"
                    multiline={true}
                    numberOfLines={5}
                    textAlignVertical="top"
                    value={feedbackText}
                    onChangeText={setFeedbackText}
                    onFocus={() => setIsFeedbackInputFocused(true)}
                    onBlur={() => setIsFeedbackInputFocused(false)}
                  />
                </View>
              )}

              {/* 2. 문의 사항 (FAQ & Support) */}
              {currentView === 'inquiry' && (
                <View style={styles.contentSection}>
                  <Text style={styles.sectionDesc}>자주 묻는 질문 및 1:1 고객 문의 센터입니다.</Text>

                  <View style={styles.faqCard}>
                    <Text style={styles.faqQ}>Q. 내가 쓴 오답노트는 익명으로 보이나요?</Text>
                    <Text style={styles.faqA}>
                      네! 작성자 정보는 전혀 노출되지 않으며 익명 유저 닉네임으로 작성됩니다.
                    </Text>
                  </View>

                  <View style={styles.faqCard}>
                    <Text style={styles.faqQ}>Q. 투표는 작성 후 수정이 가능한가요?</Text>
                    <Text style={styles.faqA}>
                      투표 참여 및 옵션 변경은 언제든 피드 카드에서 즉시 다시 클릭할 수 있습니다.
                    </Text>
                  </View>

                  <View style={styles.inquiryContactBox}>
                    <Text style={styles.inquiryContactTitle}>1:1 이메일 문의</Text>
                    <Text style={styles.inquiryContactEmail}>support@odaplove.com</Text>
                    <Text style={styles.inquiryContactSub}>평일 10:00 ~ 18:00 (주말/공휴일 제외)</Text>
                  </View>
                </View>
              )}

              {/* 3. 이용 약관 (이용약관.md 14개 조항 전문 탑재) */}
              {currentView === 'terms' && (
                <View style={styles.contentSection}>
                  <Text style={styles.introText}>
                    본 약관은 오답연애(이하 "서비스")의 이용과 관련하여 회사와 이용자 사이의 권리, 의무 및 책임사항을 규정합니다.
                  </Text>

                  <Text style={styles.articleTitle}>제1조 목적</Text>
                  <Text style={styles.articleBody}>
                    본 약관은 주식회사 오답연애(이하 "회사")가 제공하는 오답연애 어플리케이션 및 관련 제반 서비스(이하 "서비스")의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항을 규정함으로써, 집단지성을 통해 건강하고 성숙한 연애 고민 해결을 돕는 것을 목적으로 합니다.
                  </Text>

                  <Text style={styles.articleTitle}>제2조 용어의 정의</Text>
                  <Text style={styles.articleBody}>
                    본 약관에서 사용하는 용어의 정의는 다음과 같습니다:{"\n"}
                    "오답노트"란 회원이 상대방과의 갈등이나 상황에 대해 다른 회원들의 판단을 구하고자 작성한 질문 형태의 게시물을 말합니다.{"\n"}
                    "O/X 투표"란 다른 회원의 오답노트에 대해 자신의 의견(예민한지, 상대방이 잘못한 게 맞는지 등)을 표현하는 직관적인 투표 시스템을 말합니다.{"\n"}
                    "후기"란 오답노트 작성 이후 상황의 진전이나 최종 결과(그 뒤에 어떻게 되었는지 등)를 추가로 공유하는 게시물을 말합니다.{"\n"}
                    "참여"란 오답노트 및 후기 작성, 댓글 등록, O/X 투표 참여, 댓글 좋아요 클릭 등 서비스 내에서 이루어지는 모든 활동을 의미합니다.{"\n"}
                    "랭킹"이란 일정 기간 동안 서비스 내 참여도가 가장 높은 순서대로 상위 10명(Top 1~10)의 회원을 선정하여 보여주는 시스템을 말합니다.
                  </Text>

                  <Text style={styles.articleTitle}>제3조 약관의 효력 및 변경</Text>
                  <Text style={styles.articleBody}>
                    본 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.{"\n"}
                    회사는 필요한 경우 관련 법령에 위배되지 않는 범위에서 약관을 변경할 수 있으며, 변경된 약관은 적용일자 및 변경사유를 명시하여 적용일 7일 전(회원에게 불리한 변경의 경우 30일 전)부터 서비스 내에 공지합니다.{"\n"}
                    회원이 변경된 약관의 효력 발생일 이후에도 서비스를 계속 이용하는 경우, 변경된 약관에 동의한 것으로 간주합니다.
                  </Text>

                  <Text style={styles.articleTitle}>제4조 서비스 이용 및 기능의 제공</Text>
                  <Text style={styles.articleBody}>
                    회사는 회원에게 다음과 같은 서비스를 제공합니다:{"\n"}
                    오답노트 및 후기 작성·조회 기능{"\n"}
                    O/X 투표 및 댓글 작성, 댓글 좋아요 기능{"\n"}
                    피드 외부 공유 기능{"\n"}
                    참여도 기반의 랭킹(Top 1~10) 노출 시스템{"\n"}
                    고객 문의사항 접수 및 서비스 피드백 보내기 기능{"\n"}
                    부적절한 유저·게시물에 대한 신고 및 차단 기능{"\n\n"}
                    서비스 내 모든 활동은 철저히 익명으로 이루어지며, 회사는 회원의 개인 식별 정보가 서비스 상에 노출되지 않도록 시스템을 운영합니다.{"\n"}
                    서비스의 이용시간은 회사의 기술상 특별한 지장이 없는 한 연중무휴 24시간 운영을 원칙으로 합니다. 다만 시스템 정기 점검, 서버 증설 등 필요한 경우 일시 중단될 수 있으며, 이 경우 사전에 공지합니다.
                  </Text>

                  <Text style={styles.articleTitle}>제5조 회원가입 및 계정 관리</Text>
                  <Text style={styles.articleBody}>
                    회원가입은 이메일 주소 또는 소셜 계정(Google, Apple, 카카오 등) 연동을 통해 가능합니다.{"\n"}
                    회사는 다음 각 호에 해당하는 경우 가입을 거절하거나 사후에 해지할 수 있습니다:{"\n"}
                    타인의 명의 또는 계정을 도용한 경우{"\n"}
                    허위 정보를 기재하거나 회사가 제시하는 가입 요건을 충족하지 못한 경우{"\n"}
                    이전에 서비스 이용 제한 또는 강제 탈퇴 조치를 받은 적이 있는 경우{"\n"}
                    기타 관련 법령 또는 선량한 풍속을 저해할 우려가 있는 경우{"\n\n"}
                    회원은 자신의 계정 및 로그인 정보에 대한 관리 책임을 가지며, 이를 제3자에게 이용하게 해서는 안 됩니다.
                  </Text>

                  <Text style={styles.articleTitle}>제6조 게시물 및 투표 데이터의 저작권과 활용</Text>
                  <Text style={styles.articleBody}>
                    회원이 서비스 내에 작성한 오답노트, 후기, 댓글에 대한 저작권은 회원 본인에게 있습니다. 다만, 익명 서비스 특성상 다른 회원이 이를 조회하거나 서비스 내 제공되는 외부 공유 기능을 통해 피드를 공유하는 것에 동의한 것으로 간주합니다.{"\n"}
                    회원이 참여한 O/X 투표 결과 및 모든 통계 데이터는 회사의 소유로 하며, 회사는 이를 집단지성 데이터셋 구축, 서비스 개선, 콘텐츠 추천 및 마케팅 목적으로 익명화하여 활용할 수 있습니다.
                  </Text>

                  <Text style={styles.articleTitle}>제7조 개인정보보호 및 철저한 익명성 보장</Text>
                  <Text style={styles.articleBody}>
                    서비스는 안전하고 솔직한 소통을 위해 완벽한 익명 활동을 보장합니다. 회사는 법령에서 정한 예외적인 경우를 제외하고는 회원의 식별 정보를 다른 회원이나 제3자에게 공개하지 않습니다.{"\n"}
                    회원은 오답노트, 후기, 댓글 작성 시 본인 또는 전/현 연인 등 특정 개인을 식별할 수 있는 구체적인 신상 정보(이름, 연락처, 직장명, 학교, 거주지 등)를 직접 노출하지 않도록 주의하여야 합니다.{"\n"}
                    회원이 고의 또는 과실로 게시물 내에 식별 가능한 개인정보를 노출하여 발생한 모든 문제에 대해 회사는 책임을 지지 않습니다.
                  </Text>

                  <Text style={styles.articleTitle}>제8조 회원의 의무 및 커뮤니티 가이드라인</Text>
                  <Text style={styles.articleBody}>
                    회원은 건강하고 건설적인 집단지성 커뮤니티 환경을 위해 다음 각 호의 행위를 하여서는 안 됩니다:{"\n"}
                    타인을 비방, 모욕하거나 특정인에게 심한 정신적 모멸감을 주는 언행{"\n"}
                    특정 개인의 신상 정보(이름, 사진, SNS 계정 등)를 무단으로 노출하거나 유포하는 행위{"\n"}
                    음란성, 폭력성, 혐오성 게시물 또는 광고·홍보성 내용을 유포하는 행위{"\n"}
                    허위 사실을 유포하여 다른 회원들에게 혼란을 주거나 서비스 운영을 방해하는 행위{"\n"}
                    랭킹 시스템(Top 1~10) 진입 또는 특정 목적으로 매크로 등 부정한 방법을 이용하여 O/X 투표, 댓글, 좋아요 등을 조작하는 행위{"\n"}
                    기타 관련 법령 또는 약관에 위배되는 행위
                  </Text>

                  <Text style={styles.articleTitle}>제9조 신고 및 차단 정책</Text>
                  <Text style={styles.articleBody}>
                    회사는 안전한 서비스 환경 유지를 위해 [신고] 및 [차단] 기능을 제공합니다.{"\n"}
                    회원은 제8조(회원의 의무)를 위반한 부적절한 오답노트, 후기, 댓글 또는 유저를 신고할 수 있으며, 회사는 이를 가이드라인에 따라 검토 후 신속히 조치합니다.{"\n"}
                    회원은 자신이 보고 싶지 않은 특정 유저의 게시물이나 댓글을 [차단]할 수 있으며, 차단된 유저의 모든 콘텐츠는 해당 회원에게 더 이상 노출되지 않습니다.
                  </Text>

                  <Text style={styles.articleTitle}>제10조 집단지성 결과의 면책</Text>
                  <Text style={styles.articleBody}>
                    서비스 내에서 도출된 O/X 투표 결과, 댓글 의견, 랭킹 정보 등은 회원들의 자발적 참여에 기반한 '주관적이고 참고용인 의견'일 뿐이며, 회사는 이 의견의 객관적 정확성이나 연애 해결책으로서의 완벽성을 보장하지 않습니다.{"\n"}
                    다른 회원들의 의견이나 투표 결과를 바탕으로 내린 최종 판단과 행동에 대한 책임은 회원 본인에게 있습니다.
                  </Text>

                  <Text style={styles.articleTitle}>제11조 회원 탈퇴 및 데이터 처리 정책</Text>
                  <Text style={styles.articleBody}>
                    회원은 언제든지 서비스 내 설정 화면을 통해 회원 탈퇴를 신청할 수 있으며, 회사는 관련 법령이 정하는 바에 따라 이를 즉시 처리합니다.{"\n"}
                    회원이 탈퇴하더라도, 해당 회원이 작성했던 '오답노트', '후기', '댓글', '좋아요 정보' 및 'O/X 투표 참여 기록'은 다른 회원들의 집단지성 활용 서비스 흐름 유지를 위해 삭제되지 않고 서비스 내에 그대로 잔존합니다.{"\n"}
                    탈퇴와 동시에 회원의 계정 정보 및 개인 식별 정보는 시스템에서 모두 완전히 파기되므로, 서비스에 남아있는 오답노트 및 게시물은 작성자를 전혀 추적할 수 없는 '완전한 익명 상태'로 전환됩니다. 따라서 탈퇴 후에는 본인이 작성했던 게시물의 수정이나 삭제가 원천적으로 불가능합니다.
                  </Text>

                  <Text style={styles.articleTitle}>제12조 서비스 이용 제한 및 영구 제재</Text>
                  <Text style={styles.articleBody}>
                    회사는 회원이 본 약관 또는 제8조(회원의 의무)를 위반하는 경우, 사전 통보 없이 단계별로 서비스 이용을 제한할 수 있습니다:{"\n"}
                    주의/경고: 가이드라인 위반 소지가 있는 게시물 블라인드 처리 및 주의 조치{"\n"}
                    기간 이용 정지: 일정 기간 동안 오답노트/후기/댓글 작성, 투표 참여 또는 로그인 제한{"\n"}
                    영구 탈퇴 및 재가입 제한: 타인의 신상을 악의적으로 노출하거나, 시스템 조작(랭킹 어뷰징), 범죄 행위와 연관된 경우 등 중대한 위반 시 즉시 영구 제재
                  </Text>

                  <Text style={styles.articleTitle}>제13조 면책조항</Text>
                  <Text style={styles.articleBody}>
                    회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지, 디도스(DDoS) 공격 등 불가항력적인 사유로 서비스를 제공할 수 없는 경우 책임을 면합니다.{"\n"}
                    서비스 내에서 회원 간에 발생한 분쟁, 갈등, 혹은 게시된 정보를 신뢰함으로써 발생한 회원의 개인적인 손실이나 감정적 피해에 대해 회사는 법적 책임을 지지 않습니다.
                  </Text>

                  <Text style={styles.articleTitle}>제14조 분쟁 해결 및 관할법원</Text>
                  <Text style={styles.articleBody}>
                    회사와 회원 간에 발생한 전자거래 분쟁에 관한 소송은 제소 당시의 회원의 주소에 의하고, 주소가 없는 경우 거소를 관할하는 지방법원의 전속관할로 합니다.{"\n"}
                    만약 주소 또는 거소가 불명확한 경우에는 관련 법령이 정하는 바에 따릅니다.
                  </Text>

                  <Text style={styles.dateStampText}>
                    공고일자: 2026년 07월 21일 | 시행일자: 2026년 07월 21일
                  </Text>
                </View>
              )}

              {/* 4. 개인정보처리방침 (개인정보처리방침.md 전문 탑재) */}
              {currentView === 'privacy' && (
                <View style={styles.contentSection}>
                  <Text style={styles.introText}>
                    주식회사 오답연애(이하 "회사")는 「개인정보 보호법」 등 관련 법령을 준수하며, 회원의 개인정보를 보호하고 고충을 신속하게 처리하기 위해 개인정보처리방침을 수립·공개합니다.
                  </Text>

                  <Text style={styles.articleTitle}>1. 개인정보의 수집 및 이용 목적</Text>
                  <Text style={styles.articleBody}>
                    • 회원 관리: 소셜 로그인을 통한 회원 식별, 가입 의사 확인, 부정 이용 방지{"\n"}
                    • 서비스 제공: 연령별·성별 통계학적 분석 및 맞춤형 오답노트/후기 추천, 랭킹 시스템 운영{"\n"}
                    • 고충 처리: 문의사항 접수 및 피드백 반영, 불량 회원 신고/차단 조치
                  </Text>

                  <Text style={styles.articleTitle}>2. 수집하는 개인정보의 항목 및 방법</Text>
                  <Text style={styles.articleBody}>
                    • 필수 항목: 이메일 주소, 소셜 회원식별자(ID){"\n"}
                    • 선택 항목: 성별, 생년월일 (맞춤형 통계용){"\n"}
                    • 자동 수집: 이용 기록, 접속 로그, IP 정보, 기기 정보
                  </Text>

                  <Text style={styles.articleTitle}>3. 개인정보의 보유 및 이용 기간</Text>
                  <Text style={styles.articleBody}>
                    1. 회원 탈퇴 시 개인정보는 즉시 완전히 파기됩니다.{"\n"}
                    2. [중요 - 탈퇴 후 데이터 잔존 정책]: 탈퇴 시 개인 식별 정보가 완전 파기되므로 서버에 남은 오답노트/댓글은 작성자를 추적할 수 없는 '완전한 익명 데이터'로 전환되어 유지됩니다.
                  </Text>

                  <Text style={styles.articleTitle}>4. 개인정보의 제3자 제공 및 처리위탁</Text>
                  <Text style={styles.articleBody}>
                    회사는 회원의 사전 동의 없이는 원칙적으로 개인정보를 외부에 제공하거나 위탁하지 않습니다.
                  </Text>

                  <Text style={styles.articleTitle}>5. 정보주체의 권리·의무 및 행사방법</Text>
                  <Text style={styles.articleBody}>
                    회원은 언제든지 개인정보 열람·정정·삭제 요구를 할 수 있으며, 탈퇴 완료 후에는 익명 전환되어 게시물에 대한 직접 정정/삭제 요구가 불가능하므로 탈퇴 전 직접 삭제하셔야 합니다.
                  </Text>

                  <Text style={styles.articleTitle}>6. 개인정보의 파기 절차 및 방법</Text>
                  <Text style={styles.articleBody}>
                    전자적 파일 형태의 개인정보는 복구할 수 없는 기술적 방법을 사용하여 파기합니다.
                  </Text>

                  <Text style={styles.articleTitle}>7. 개인정보의 안전성 확보 조치</Text>
                  <Text style={styles.articleBody}>
                    암호화 전송 및 데이터 백신 설치, 개인정보 취급 직원의 최소화 및 보안 교육을 이행합니다.
                  </Text>

                  <Text style={styles.articleTitle}>8. 개인정보 보호책임자 및 고충처리</Text>
                  <Text style={styles.articleBody}>
                    • 책임자: 대표이사 / 개인정보 보호책임자{"\n"}
                    • 이메일: support@odaplove.com
                  </Text>

                  <Text style={styles.dateStampText}>
                    공고일자: 2026년 07월 21일 | 시행일자: 2026년 07월 21일
                  </Text>
                </View>
              )}

              {/* 5. 계정 설정 */}
              {currentView === 'settings' && (
                <View style={styles.contentSection}>
                  {/* Account Info Box */}
                  <View style={styles.settingBox}>
                    <Text style={styles.settingLabel}>연동 계정</Text>
                    <Text style={styles.settingVal}>{userEmail}</Text>
                  </View>

                  {/* Notifications Controls */}
                  <View style={styles.settingRow}>
                    <Text style={styles.settingRowTitle}>사연 반응 및 댓글 푸시 알림</Text>
                    <Switch
                      value={pushNoti}
                      onValueChange={setPushNoti}
                      trackColor={{ false: '#E2E8F0', true: '#FF8E7A' }}
                      thumbColor="#FFFFFF"
                    />
                  </View>

                  <View style={styles.settingRow}>
                    <Text style={styles.settingRowTitle}>마케팅 혜택 알림 수신</Text>
                    <Switch
                      value={marketingNoti}
                      onValueChange={setMarketingNoti}
                      trackColor={{ false: '#E2E8F0', true: '#FF8E7A' }}
                      thumbColor="#FFFFFF"
                    />
                  </View>

                  {/* Logout & Withdrawal Buttons */}
                  <View style={styles.dangerZoneGroup}>
                    <TouchableOpacity
                      style={styles.logoutBtn}
                      onPress={() => {
                        handleClose();
                        if (onLogout) onLogout();
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.logoutBtnText}>로그아웃</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.withdrawBtn}
                      onPress={() => {
                        if (Platform.OS === 'web') alert('탈퇴 안내: 회원 탈퇴 기능 처리되었습니다.');
                        else Alert.alert('안내', '회원 탈퇴 처리되었습니다.');
                        handleClose();
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.withdrawBtnText}>회원 탈퇴</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* 6. 후기 작성 바텀시트 모달 */}
              {currentView === 'write_review' && (
                <View style={styles.contentSection}>
                  <Text style={styles.sectionDesc}>
                    O/X 투표 이후 상대방과의 상황이 어떻게 진행되었나요? 후기를 공유하면 다른 유저들의 연애 고민 해결에 큰 도움이 됩니다!
                  </Text>
                  <TextInput
                    style={styles.feedbackInput}
                    placeholder="결과나 당시 대화 내용, 현재 상태 등을 들려주세요."
                    placeholderTextColor="#BCBCBC"
                    multiline={true}
                    numberOfLines={5}
                    textAlignVertical="top"
                  />
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => {
                      if (Platform.OS === 'web') alert('후기가 등록되었습니다!');
                      else Alert.alert('완료', '후기가 등록되었습니다!');
                      handleClose();
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.primaryButtonText}>후기 등록 완료</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* 7. 작성한 후기 보기 바텀시트 모달 */}
              {currentView === 'view_review' && (
                <View style={styles.contentSection}>
                  <View style={styles.reviewCardView}>
                    <Text style={styles.reviewCardBadge}>✨ 후기 내용</Text>
                    <Text style={styles.reviewCardText}>
                      "결국 솔직하게 서운했던 부분 대화 나누고 서로 이해했어요! 다들 O 투표로 제 편을 들어주셔서 용기 얻고 대화할 수 있었습니다. 감사합니다!"
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Sticky Button Above Keyboard when feedback input is focused */}
            {currentView === 'feedback' && isFeedbackInputFocused && (
              <View style={styles.keyboardStickyBtnWrapper}>
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    !feedbackText.trim() && styles.primaryButtonDisabled,
                  ]}
                  onPress={handleSendFeedback}
                  activeOpacity={0.8}
                  disabled={!feedbackText.trim() || feedbackSubmitted}
                >
                  <Text
                    style={[
                      styles.primaryButtonText,
                      !feedbackText.trim() && styles.primaryButtonTextDisabled,
                    ]}
                  >
                    {feedbackSubmitted ? '전송 중...' : '피드백 전송하기'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  keyboardAvoidingView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bottomSheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
    height: 540,
    maxHeight: '82%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    margin: 0,
    marginBottom: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  handlePill: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EBEBEB',
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    padding: 2,
    marginRight: 4,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  closeBtn: {
    padding: 4,
  },
  scrollArea: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 50,
  },
  contentSection: {
    gap: 16,
  },
  hubMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  hubMenuText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0F172A',
  },
  introText: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
    marginBottom: 8,
  },
  sectionDesc: {
    fontSize: 15,
    color: '#9C9C9C',
    lineHeight: 22,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  feedbackInput: {
    width: '100%',
    height: 140,
    borderRadius: 16,
    backgroundColor: '#F8F8F8',
    borderWidth: 0,
    padding: 16,
    fontSize: 15,
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  keyboardStickyBtnWrapper: {
    width: '100%',
    paddingTop: 12,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF8E7A',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#FF8E7A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonDisabled: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  primaryButtonTextDisabled: {
    color: '#9C9C9C',
    fontWeight: '700',
  },
  faqCard: {
    width: '100%',
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  faqQ: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  faqA: {
    fontSize: 14,
    color: '#9C9C9C',
    lineHeight: 20,
  },
  inquiryContactBox: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 18,
    marginTop: 8,
  },
  inquiryContactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  inquiryContactEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF8E7A',
    marginBottom: 4,
  },
  inquiryContactSub: {
    fontSize: 13,
    color: '#9C9C9C',
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 10,
  },
  articleBody: {
    fontSize: 14.5,
    color: '#9C9C9C',
    lineHeight: 22,
  },
  dateStampText: {
    fontSize: 13,
    color: '#9C9C9C',
    marginTop: 16,
    textAlign: 'center',
  },
  settingBox: {
    width: '100%',
    height: 56,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 15,
    color: '#9C9C9C',
  },
  settingVal: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  settingRow: {
    width: '100%',
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingRowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  dangerZoneGroup: {
    marginTop: 24,
    gap: 12,
  },
  logoutBtn: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  withdrawBtn: {
    width: '100%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  withdrawBtnText: {
    fontSize: 14,
    color: '#9C9C9C',
    textDecorationLine: 'underline',
  },
  reviewCardView: {
    width: '100%',
    backgroundColor: '#F8F8F8',
    borderRadius: 18,
    padding: 22,
    marginTop: 6,
  },
  reviewCardBadge: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF8E7A',
  },
  reviewCardText: {
    fontSize: 15,
    color: '#0F172A',
    lineHeight: 23,
    letterSpacing: -0.3,
  },
  reviewCardDate: {
    fontSize: 13,
    color: '#9C9C9C',
    marginTop: 4,
  },
});
