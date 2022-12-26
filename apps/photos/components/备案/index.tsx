import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Image from 'next/image';
import 备案编号图标 from 'public/备案编号图标.png';
import { useEffect, useLayoutEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';

const 备案Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: white;
  padding: 16px 20px;

  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 2;

  @media (max-width: 959px) {
    & {
      visibility: hidden;
    }
  }
`;

const StyledLink = styled.a`
  text-decoration: none;
  color: black;
  letter-spacing: 1.5px;
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 300;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;

export default function Beian() {
  return (
    <备案Container>
      <StyledLink
        href="https://beian.miit.gov.cn/"
        target="_blank"
        className="link"
        rel="noreferrer"
      >
        沪ICP备2021013570号-1
      </StyledLink>
      &nbsp;
      <Image
        css={css(`
            vertical-align: baseline;
          `)}
        src={备案编号图标}
        height="14"
        alt="备案编号图标"
      ></Image>
      &nbsp;
      <StyledLink
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31011002005580"
        target="_blank"
        className="link"
        rel="noreferrer"
      >
        沪公网安备 31011002005580号
      </StyledLink>
    </备案Container>
  );
}
