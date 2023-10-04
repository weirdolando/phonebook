import styled from "@emotion/styled";
import Icon from "../Icon";
import { COLORS } from "@/app/constants";
import VisuallyHidden from "../VisuallyHidden";

interface Props {
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchInput({
  placeholder = "",
  onChange,
  ...delegated
}: Props) {
  return (
    <InputWrapper {...delegated}>
      <VisuallyHidden>
        <label>Search</label>
      </VisuallyHidden>
      <SearchInputContainer>
        <SearchIcon id="search" size={16} />
        <Input type="text" placeholder={placeholder} onChange={onChange} />
      </SearchInputContainer>
    </InputWrapper>
  );
}

const InputWrapper = styled.div`
  width: 100%;
  max-width: 350px;

  @media (min-width: 768px) {
    width: 50%;
  }
`;

const SearchInputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchIcon = styled(Icon)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  padding-left: 0.75rem;
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 2.5rem;
  font-size: 0.875rem;
  color: ${COLORS.gray[900]};
  border: 1px solid ${COLORS.gray[300]};
  border-radius: 0.375rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus {
    border-color: ${COLORS.green[600]};
    box-shadow: 0 0 0 2px ${COLORS.green[600]};
  }
`;
