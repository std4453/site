import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Image from 'next/image';
import BeianIcon from 'public/备案编号图标.png';
import { portraitQuery } from 'utils/responsive';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: white;
  padding: 0 0.75rem;
  height: 3.5rem;
  gap: 0.5rem;

  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 2;

  @media ${portraitQuery} {
    & {
      display: none;
    }
  }

  user-select: none;
`;

const StyledLink = styled.a`
  text-decoration: none;
  color: black;
  letter-spacing: 0.03em;
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

export default function Beian() {
  return (
    <StyledContainer draggable="false">
      <StyledLink
        href="https://beian.miit.gov.cn/"
        target="_blank"
        className="link"
        rel="noreferrer"
      >
        沪ICP备 2021013570号-1
      </StyledLink>
      <Image
        css={css(`
        width: 1rem;
        height: 1rem;
      `)}
        src={BeianIcon}
        alt="备案编号图标"
        draggable="false"
      ></Image>
      <StyledLink
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31011002005580"
        target="_blank"
        className="link"
        rel="noreferrer"
      >
        沪公网安备 31011002005580号
      </StyledLink>
    </StyledContainer>
  );
}
