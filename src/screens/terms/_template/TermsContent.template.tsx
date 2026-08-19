import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export function TermsContentTemplate() {
  return (
    <View style={styles.contentSection}>
      <Text style={styles.introText}>
        본 약관은 연OX(이하 "서비스")의 이용과 관련하여 운영팀과 이용자 사이의 권리, 의무, 책임사항 및 커뮤니티 이용 규칙을 규정합니다. 이용자는 본 서비스 이용약관에 동의함으로서 서비스 내 모든 활동 수칙과 가이드라인을 완전하게 준수할 것을 약속합니다.
      </Text>

      <Text style={styles.articleTitle}>제1조 (목적)</Text>
      <Text style={styles.articleBody}>
        본 약관은 연OX가 제공하는 애플리케이션 및 제반 서비스의 이용조건, 절차, 회원과 서비스 간의 권리와 의무, 내 연애 성향 테스트, AI 챗봇 상담 기능, 고민글 투표/댓글 피드 및 커뮤니티 활동 수칙을 규정함으로써 집단지성을 통한 성숙하고 건전한 연애 고민 해결을 돕는 것을 목적으로 합니다.
      </Text>

      <Text style={styles.articleTitle}>제2조 (용어의 정의 및 기능 안내)</Text>
      <Text style={styles.articleBody}>
        1. "연OX 고민글"이란 회원이 상대방과의 연애 갈등이나 특정 상황에 대해 다른 회원들의 판단과 의견을 구하고자 작성한 게시물을 말합니다.{"\n"}
        2. "O/X 투표"란 다른 회원의 사연에 대해 자신의 찬성(O) 또는 반대(X) 의사를 직관적으로 표현하는 투표 시스템을 말합니다.{"\n"}
        3. "성향별 분기 댓글"이란 자신이 투표한 선택지(O 또는 X)의 성향에 해당하는 주장과 의견을 댓글 및 답글로 소통하는 피드백 시스템입니다.{"\n"}
        4. "작성자 후기"란 등록된 고민 사연글의 해결 상황이나 사후 결과를 공유하기 위해 작성자가 올리는 추가 후기 콘텐츠를 말합니다.{"\n"}
        5. "내 연애 성향 테스트"란 10가지 사물 모티브 기반으로 회원의 4대 연애 스탯, 갈등 해결 방식, 취약점 및 이별 권유 기준을 도출해주는 성향 진단 기능입니다.{"\n"}
        6. "AI 선택지 자동 생성"이란 게시글 작성 시 회원이 입력한 사연 맥락을 AI가 실시간 분석하여 투표 선택지(O/X) 문구를 자동으로 추천해주는 기능입니다.{"\n"}
        7. "1:1 AI 상담 (두림이)"이란 유저의 연애 성향 진단 결과 및 작성 고민 사연 데이터를 토대로 맞춤형 1:1 상담 및 솔루션을 제공하는 AI 상담사 기능입니다.{"\n"}
        8. "익명 닉네임 표기 규칙"이란 서비스 내 소통의 익명성 보장을 위해 글쓴이는 '글쓴이'로, 댓글 작성자는 등록 순서에 따라 '익명1', '익명2'...의 독립적인 일련번호로 표시되는 시스템을 말합니다.
      </Text>

      <Text style={styles.articleTitle}>제3조 (주요 기능 및 AI 서비스 이용)</Text>
      <Text style={styles.articleBody}>
        서비스가 제공하는 주요 서비스 및 AI 부가 기능은 다음과 같습니다:{"\n"}
        1. 내 연애 성향 테스트: 유저의 진단 결과를 분석하여 성향 분석 카드를 생성하고 1:1 AI 상담 시 맞춤 맥락으로 연동합니다.{"\n"}
        2. AI 선택지 자동 생성: 게시글 작성 시 본문 맥락을 분석하여 찬반 선택지 텍스트를 자동으로 추천합니다.{"\n"}
        3. 1:1 AI 상담 (두림이): 연애 성향 및 고민 사연을 바탕으로 인라인 선택 분기를 통해 1:1 맞춤 솔루션을 대화형으로 제공합니다.{"\n"}
        4. 서비스 내 모든 데이터는 철저한 익명 상태로 보호되며, 서비스 개선 및 맞춤 솔루션 제공 목적으로만 활용됩니다.
      </Text>

      <Text style={styles.articleTitle}>제4조 (철저한 익명성 보장 및 개인정보 보호)</Text>
      <Text style={styles.articleBody}>
        1. 본 서비스는 모든 활동에 대해 완전한 익명성을 보장합니다. 서비스는 법령에 특별한 규정이 있는 경우를 제외하고 회원의 식별 정보를 제3자에게 노출하거나 수집하지 않습니다.{"\n"}
        2. 회원은 게시물이나 댓글 작성 시 본인 또는 전/현 연인 등 특정 개인을 추적하거나 식별할 수 있는 개인 신상 정보(이름, 전화번호, 직장명, 거주지, SNS 계정 등)를 노출해서는 안 됩니다.{"\n"}
        3. 회원이 고의 또는 과실로 게시물 내에 신상 정보를 직접 노출하여 발생한 문제에 대해 서비스는 법적 책임을 지지 않습니다.
      </Text>

      <Text style={styles.articleTitle}>제5조 (커뮤니티 이용 규칙 및 금지 행위)</Text>
      <Text style={styles.articleBody}>
        회원은 다음 각 호의 가이드라인을 엄격히 준수해야 하며, 위반 시 강력한 이용 제한 조치가 적용됩니다:{"\n"}
        1. 무지성 초성 남발, 자판 도배 및 의미 없는 스팸성 게시글 작성 금지{"\n"}
        2. 영리 목적의 광고, 홍보성 글, 스팸, 매크로 이용 조작 행위 금지{"\n"}
        3. 상대방에 대한 근거 없는 비방, 혐오 표현, 악성 댓글 및 모욕 행위 금지{"\n"}
        4. 타인의 개인 신상 정보 무단 유포 및 사생활 침해 행위 금지{"\n"}
        5. 기타 관련 법령 및 선량한 풍속에 반하는 모든 불법 행위 금지
      </Text>

      <Text style={styles.articleTitle}>제6조 (부적절 게시물 제재, 차단 및 신고 조치)</Text>
      <Text style={styles.articleBody}>
        서비스는 건전하고 안전한 커뮤니티 환경 유지를 위해 다음 제재 조치를 시행합니다:{"\n"}
        1. 즉시 블라인드 및 삭제: 제5조 위반 게시물 및 댓글은 자동 감지 및 신고에 의해 사전 통보 없이 즉시 삭제/블라인드 처리됩니다.{"\n"}
        2. 신고 접수 및 차단 조치: 유저 신고가 누적된 게시물과 사용자는 시스템 검토 후 경고, 서비스 이용 제한, 계정 차단 조치가 취해집니다.{"\n"}
        3. 차단 시스템: 특정 유저를 직접 차단할 수 있으며, 차단된 유저가 작성한 게시글과 댓글은 피드 상에서 완전히 숨김 처리됩니다.
      </Text>

      {/* 커뮤니티 가이드라인 및 신고/차단 테이블 */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <View style={[styles.tableCell, { flex: 1 }]}><Text style={styles.tableHeaderText}>위반 항목</Text></View>
          <View style={[styles.tableCell, { flex: 1.5 }]}><Text style={styles.tableHeaderText}>신고 인정 기준</Text></View>
          <View style={[styles.tableCell, { flex: 1.2 }]}><Text style={styles.tableHeaderText}>1~2회 누적</Text></View>
          <View style={[styles.tableCell, { flex: 1.2 }]}><Text style={styles.tableHeaderText}>3회 누적</Text></View>
        </View>

        <View style={styles.tableRow}>
          <View style={[styles.tableCell, { flex: 1 }]}><Text style={styles.tableRowText}>욕설 및 비하</Text></View>
          <View style={[styles.tableCell, { flex: 1.5 }]}><Text style={styles.tableRowText}>타인 인신공격, 조롱, 혐오 발언</Text></View>
          <View style={[styles.tableCell, { flex: 1.2 }]}><Text style={styles.tableRowText}>콘텐츠 즉시 삭제 및 경고</Text></View>
          <View style={[styles.tableCell, { flex: 1.2 }]}><Text style={styles.tableRowTextRed}>영구정지 및 강제탈퇴</Text></View>
        </View>

        <View style={styles.tableRow}>
          <View style={[styles.tableCell, { flex: 1 }]}><Text style={styles.tableRowText}>도배 및 스팸</Text></View>
          <View style={[styles.tableCell, { flex: 1.5 }]}><Text style={styles.tableRowText}>의미 없는 연속 글, 상업적 광고</Text></View>
          <View style={[styles.tableCell, { flex: 1.2 }]}><Text style={styles.tableRowText}>콘텐츠 즉시 삭제 및 경고</Text></View>
          <View style={[styles.tableCell, { flex: 1.2 }]}><Text style={styles.tableRowTextRed}>영구정지 및 강제탈퇴</Text></View>
        </View>

        <View style={styles.tableRow}>
          <View style={[styles.tableCell, { flex: 1 }]}><Text style={styles.tableRowText}>신상 유포</Text></View>
          <View style={[styles.tableCell, { flex: 1.5 }]}><Text style={styles.tableRowText}>실명, 연락처, 거주지, SNS 무단 노출</Text></View>
          <View style={[styles.tableCell, { flex: 1.2 }]}><Text style={styles.tableRowText}>경고 없이 콘텐츠 완전 삭제</Text></View>
          <View style={[styles.tableCell, { flex: 1.2 }]}><Text style={styles.tableRowTextRed}>영구정지 및 강제탈퇴</Text></View>
        </View>

        <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
          <View style={[styles.tableCell, { flex: 1 }]}><Text style={styles.tableRowText}>허위 신고</Text></View>
          <View style={[styles.tableCell, { flex: 1.5 }]}><Text style={styles.tableRowText}>무고 유저를 고의로 반복 신고</Text></View>
          <View style={[styles.tableCell, { flex: 1.2 }]}><Text style={styles.tableRowText}>신고 기능 7일 제한 및 경고</Text></View>
          <View style={[styles.tableCell, { flex: 1.2 }]}><Text style={styles.tableRowTextRed}>영구정지 및 강제탈퇴</Text></View>
        </View>
      </View>

      <Text style={styles.articleTitle}>제7조 (게시물의 저작권 및 서비스 탈퇴 시 데이터 처리)</Text>
      <Text style={styles.articleBody}>
        1. 회원이 작성한 게시물 및 댓글의 저작권은 작성자 본인에게 있으나, 서비스 내 노출 및 공유 기능 활용에 동의한 것으로 간주합니다.{"\n"}
        2. 회원 탈퇴 시 계정 식별 개인정보는 완전히 파기되나, 다른 회원의 집단지성 데이터 맥락 유지를 위해 작성한 게시물, 댓글, 투표 기록은 파기되지 않고 작성자를 추적할 수 없는 '완전 익명 상태'로 서비스 내에 잔존합니다.
      </Text>

      <Text style={styles.articleTitle}>제8조 (면책조항 및 분쟁 해결)</Text>
      <Text style={styles.articleBody}>
        1. O/X 투표 결과, 찬반 댓글 및 AI 두림이의 상담 답변은 참고용 조언일 뿐이며, 이를 바탕으로 내린 회원의 개별 판단과 행위에 대한 최종 책임은 회원 본인에게 있습니다.{"\n"}
        2. 서비스는 회원 간에 발생한 분쟁이나 감정적 피해에 대해 책임을 지지 않습니다.
      </Text>

      <Text style={styles.dateStampText}>
        공고일자: 2026년 08월 19일 | 개정 및 시행일자: 2026년 08월 19일
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contentSection: {
    gap: 16,
  },
  introText: {
    fontSize: 13.5,
    color: '#727272',
    lineHeight: 20,
    marginBottom: 8,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 10,
  },
  articleBody: {
    fontSize: 13,
    color: '#8F8F8F',
    lineHeight: 19,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 6,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFF1F2',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
  },
  tableCell: {
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E11D48',
    textAlign: 'center',
  },
  tableRowText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#475569',
    lineHeight: 14,
  },
  tableRowTextRed: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E11D48',
    lineHeight: 14,
  },
  dateStampText: {
    fontSize: 12,
    color: '#C0C0C0',
    marginTop: 16,
    textAlign: 'center',
  },
});
