import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';
import { RelationshipProfile } from '../_state/useRelationshipProfileStore';
import { StatSegmentRow } from '../_component/StatSegmentRow';
import { RetryQuizButtonAction } from '../_action/RetryQuizButton.action';

const ARCHETYPE_IMAGES: Record<string, any> = {
  '말랑말랑 리트리버 인형': require('../../../assets/archetypes/archetype_01_retriever.png'),
  '폭신폭신 수면베개': require('../../../assets/archetypes/archetype_02_pillow.png'),
  '착착 스위스 아미 칼': require('../../../assets/archetypes/archetype_03_swiss_knife.png'),
  '단단한 압력밥솥': require('../../../assets/archetypes/archetype_04_rice_cooker.png'),
  '톡 쏘는 탄산음료 캔': require('../../../assets/archetypes/archetype_05_soda_can.png'),
  '잠금장치 다이어리': require('../../../assets/archetypes/archetype_06_diary.png'),
  '바스락 쿠쿠다스 과자': require('../../../assets/archetypes/archetype_07_cookie.png'),
  '반짝이는 도자기 선인장': require('../../../assets/archetypes/archetype_08_cactus.png'),
  '동글동글 몽돌 돌멩이': require('../../../assets/archetypes/archetype_09_stone.png'),
  '쫀득쫀득 딱풀': require('../../../assets/archetypes/archetype_10_glue.png'),
};

interface ProfileAnalysisCardAreaProps {
  profile: RelationshipProfile;
}

export function ProfileAnalysisCardArea({
  profile,
}: ProfileAnalysisCardAreaProps) {
  return (
    <View style={styles.singleProfileCard}>
      {/* Retry Icon Action Top Right */}
      <RetryQuizButtonAction />

      {/* 1. Large Coral Main Archetype Title */}
      <Text style={styles.archetypeMainTitle}>
        {profile.typeTitle.replace(/[🛡️🌸🌿]/g, '').trim()}
      </Text>

      {/* 2. Sub-title / Catchphrase */}
      <Text style={styles.archetypeSubText}>{profile.typeOneLiner}</Text>

      {/* 3. Center Graphic Illustration */}
      <View style={styles.archetypeGraphicWrap}>
        <Image
          source={
            ARCHETYPE_IMAGES[profile.typeTitle] ||
            require('../../../assets/counselor_momo.png')
          }
          style={styles.archetypeGraphicImg}
          resizeMode="contain"
        />
      </View>

      {/* 4. Tendency Segmented Progress Bars */}
      <View style={styles.statsContainer}>
        {(
          profile.stats || [
            { label: '표현 솔직도', level: 5 },
            { label: '애정 집착도', level: 2 },
            { label: '감정 포용력', level: 4 },
            { label: '갈등 해결력', level: 5 },
          ]
        ).map((stat, idx) => (
          <StatSegmentRow
            key={idx}
            label={stat.label}
            level={stat.level}
          />
        ))}
      </View>

      <View style={styles.profileDividerLight} />

      {/* 5. Clean Bullet List */}
      <View style={styles.bulletListWrap}>
        <View style={styles.bulletBlock}>
          <Text style={styles.bulletHeaderTitle}>
            · <Text style={styles.bulletHighlight}>갈등 해결 방식</Text>
          </Text>
          <Text style={styles.bulletDesc}>{profile.conflictHeadline}</Text>
        </View>

        <View style={styles.bulletBlock}>
          <Text style={styles.bulletHeaderTitle}>
            · <Text style={styles.bulletHighlight}>잘 맞는 상대</Text>
          </Text>
          <Text style={styles.bulletDesc}>
            {profile.matchPartnerHeadline}
          </Text>
        </View>

        <View style={styles.bulletBlock}>
          <Text style={styles.bulletHeaderTitle}>
            · <Text style={styles.bulletHighlight}>취약점</Text>
          </Text>
          <Text style={styles.bulletDesc}>
            {profile.vulnerabilityHeadline}
          </Text>
        </View>

        <View style={styles.bulletBlockWarning}>
          <Text style={styles.bulletHeaderTitleRed}>
            · <Text style={styles.bulletHighlightRed}>이별 권유 기준</Text>
          </Text>
          {profile.avoidPartners.map((item, idx) => (
            <Text key={idx} style={styles.bulletSubDesc}>
              - {item.desc}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  singleProfileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 22,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginTop: 4,
    marginBottom: 28,
    position: 'relative',
  },
  archetypeMainTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FF5D7B',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  archetypeSubText: {
    fontSize: 13,
    color: '#8F8F8F',
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  archetypeGraphicWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  archetypeGraphicImg: {
    width: 140,
    height: 140,
  },
  statsContainer: {
    marginTop: 14,
    gap: 8,
  },
  profileDividerLight: {
    width: '100%',
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 18,
  },
  bulletListWrap: {
    gap: 14,
  },
  bulletBlock: {
    gap: 3,
  },
  bulletHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  bulletHighlight: {
    color: '#FF5D7B',
  },
  bulletDesc: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
    paddingLeft: 10,
  },
  bulletBlockWarning: {
    gap: 3,
    backgroundColor: '#FFF1F2',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
  bulletHeaderTitleRed: {
    fontSize: 13,
    fontWeight: '700',
    color: '#BE123C',
  },
  bulletHighlightRed: {
    color: '#E11D48',
  },
  bulletSubDesc: {
    fontSize: 12,
    color: '#9F1239',
    lineHeight: 17,
    paddingLeft: 8,
  },
});
