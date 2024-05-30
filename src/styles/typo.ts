import { TextStyle } from 'react-native';

const title2: TextStyle = {
  fontSize: 17,
  lineHeight: 22,
  fontWeight: '400',
  letterSpacing: 0.35,
};

const title2Emphasized: TextStyle = {
  ...title2,
  fontWeight: '600',
};

const title3: TextStyle = {
  fontSize: 15,
  lineHeight: 20,
  fontWeight: '400',
  letterSpacing: 0.35,
};

const title3Emphasized: TextStyle = {
  ...title3,
  fontWeight: '600',
};

const headline: TextStyle = {
  fontSize: 14,
  lineHeight: 16,
  fontWeight: '600',
  letterSpacing: 0.35,
};

const headlineEmphasized: TextStyle = {
  ...headline,
  fontWeight: '800',
};

const body: TextStyle = {
  fontSize: 13,
  lineHeight: 18,
  fontWeight: '400',
};

const bodyEmphasized: TextStyle = {
  ...body,
  fontWeight: '500',
};

const callout: TextStyle = {
  fontSize: 12,
  lineHeight: 17,
  fontWeight: '400',
};

const calloutEmphasized: TextStyle = {
  ...callout,
  fontWeight: '600',
};

const subheadline: TextStyle = {
  fontSize: 11,
  lineHeight: 14,
  fontWeight: '400',
};

const subheadlineEmphasized: TextStyle = {
  ...subheadline,
  fontWeight: '600',
};

const footnote: TextStyle = {
  fontSize: 10,
  lineHeight: 13,
  fontWeight: '400',
};

const footnoteEmphasized: TextStyle = {
  ...footnote,
  fontWeight: '600',
};

export const typo = {
  title2,
  title2Emphasized,
  title3,
  title3Emphasized,
  headline,
  headlineEmphasized,
  body,
  bodyEmphasized,
  callout,
  calloutEmphasized,
  subheadline,
  subheadlineEmphasized,
  footnote,
  footnoteEmphasized,
};
