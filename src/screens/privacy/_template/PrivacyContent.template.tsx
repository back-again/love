import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export function PrivacyContentTemplate() {
  return (
    <View style={styles.contentSection}>
      <Text style={styles.introText}>
        연OX 운영팀(이하 "운영팀")은 「개인정보 보호법」 등 관련 법령을 준수하며, 회원의 개인정보를 보호하고 고충을 신속하게 처리하기 위해 개인정보처리방침을 수립·공개합니다.
      </Text>

      <Text style={styles.articleTitle}>1. 개인정보의 수집 및 이용 목적</Text>
      <Text style={styles.articleBody}>
        • 회원 관리: 애플 소셜 로그인을 통한 회원 식별, 부정 이용 방지{"\n"}
        • 서비스 제공: 고민글 및 찬반 투표 결과 조회, 연애 성향 진단 분석 데이터 관리, 1:1 AI 상담 내역 관리{"\n"}
        • 고충 처리: 문의사항 접수 및 피드백 반영, 불량 회원 신고 및 차단 조치
      </Text>

      <Text style={styles.articleTitle}>2. 수집하는 개인정보의 항목 및 방법</Text>
      <Text style={styles.articleBody}>
        • 필수 항목: 이메일 주소, 소셜 회원식별자(ID){"\n"}
        • 선택 항목: 성별, 생년월일 (맞춤형 성향 분석용){"\n"}
        • 자동 수집: 서비스 이용 기록, 접속 로그, 기기 정보
      </Text>

      <Text style={styles.articleTitle}>3. 개인정보의 보유 및 이용 기간</Text>
      <Text style={styles.articleBody}>
        1. 회원 탈퇴 시 개인 식별 정보는 즉시 완전히 파기됩니다.{"\n"}
        2. [중요 - 탈퇴 후 데이터 잔존 정책]: 탈퇴 시 개인 식별 정보가 완전 파기되므로 서버에 남은 고민글, 댓글, 투표 기록은 작성자를 추적할 수 없는 '완전한 익명 데이터'로 전환되어 유지됩니다.
      </Text>

      <Text style={styles.articleTitle}>4. 개인정보의 제3자 제공 및 처리위탁</Text>
      <Text style={styles.articleBody}>
        운영팀은 회원의 사전 동의 없이는 원칙적으로 개인정보를 외부에 제공하거나 위탁하지 않습니다.
      </Text>

      <Text style={styles.articleTitle}>5. 정보주체의 권리·의무 및 행사방법</Text>
      <Text style={styles.articleBody}>
        회원은 언제든지 개인정보 열람·정정·삭제 요구를 할 수 있으며, 탈퇴 완료 후에는 익명 전환되어 게시물에 대한 직접 정정/삭제 요구가 불가능하므로 탈퇴 전 직접 삭제하셔야 합니다.
      </Text>

      <Text style={styles.articleTitle}>6. 개인정보의 파기 절차 및 방법</Text>
      <Text style={styles.articleBody}>
        전자적 파일 형태의 개인정보는 복구할 수 없는 기술적 방법을 사용하여 완전히 파기합니다.
      </Text>

      <Text style={styles.articleTitle}>7. 개인정보의 안전성 확보 조치</Text>
      <Text style={styles.articleBody}>
        암호화 전송 및 보안 서버 구축, 취급 인원의 최소화 및 관리자 보안 수칙을 준수합니다.
      </Text>

      <Text style={styles.articleTitle}>8. 개인정보 보호책임자 및 고충처리</Text>
      <Text style={styles.articleBody}>
        • 책임자: 연OX 운영 책임자{"\n"}
        • 이메일: rsj01223@gmail.com
      </Text>

      <Text style={styles.dateStampText}>
        공고일자: 2026년 08월 19일 | 시행일자: 2026년 08월 19일
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contentSection: {
    gap: 16,
  },
  introText: {
    fontSize: 15,
    color: '#727272',
    lineHeight: 22,
    marginBottom: 8,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 10,
  },
  articleBody: {
    fontSize: 14.5,
    color: '#8F8F8F',
    lineHeight: 22,
  },
  dateStampText: {
    fontSize: 13,
    color: '#8F8F8F',
    marginTop: 16,
    textAlign: 'center',
  },
});
