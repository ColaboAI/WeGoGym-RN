import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';

type Props = {
  backgroundColor: string;
  foregroundColor: string;
};
const GymInfoLoader = (props: Props) => (
  <ContentLoader
    speed={2}
    width={400}
    height={800}
    viewBox="0 0 400 800"
    backgroundColor={props.backgroundColor}
    foregroundColor={props.foregroundColor}>
    <Rect x="17" y="0" rx="5" ry="5" width="35%" height="25" />
    <Rect x="17" y="35" rx="5" ry="5" width="88%" height="25" />
    <Rect x="17" y="70" rx="5" ry="5" width="83%" height="23" />
    <Rect x="17" y="105" rx="5" ry="5" width="35%" height="25" />
    <Rect x="17" y="140" rx="5" ry="5" width="88%" height="25" />
    <Rect x="17" y="175" rx="5" ry="5" width="86%" height="23" />
    <Rect x="17" y="210" rx="5" ry="5" width="35%" height="25" />
    <Rect x="17" y="245" rx="5" ry="5" width="88%" height="25" />
    <Rect x="17" y="280" rx="5" ry="5" width="86%" height="23" />
    <Rect x="17" y="315" rx="5" ry="5" width="35%" height="25" />
    <Rect x="17" y="350" rx="5" ry="5" width="88%" height="25" />
    <Rect x="17" y="385" rx="5" ry="5" width="86%" height="23" />
    <Rect x="17" y="420" rx="5" ry="5" width="35%" height="25" />
    <Rect x="17" y="455" rx="5" ry="5" width="88%" height="25" />
    <Rect x="17" y="490" rx="5" ry="5" width="86%" height="23" />
    <Rect x="17" y="525" rx="5" ry="5" width="35%" height="25" />
    <Rect x="17" y="560" rx="5" ry="5" width="88%" height="25" />
    <Rect x="17" y="595" rx="5" ry="5" width="86%" height="23" />
  </ContentLoader>
);

export default GymInfoLoader;
