"use client";

import { useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import styled from "@emotion/styled";

import { COLORS, WEIGHTS } from "@/app/constants";
import {
  ADD_CONTACT_WITH_PHONES,
  ADD_NUMBER_TO_CONTACT,
  DELETE_NUMBER_FROM_CONTACT,
  EDIT_CONTACT,
  GET_CONTACT_LIST,
} from "@/app/graphql/queries";
import {
  errorAlertWithMessage,
  successAlertWithMessage,
} from "@/app/helpers/alerts";

import Icon from "../Icon";
import Spacer from "../Spacer";
import LoadingButton from "../LoadingButton";
import useContactDetail from "@/app/graphql/hooks/useContactDetail";
import VisuallyHidden from "../VisuallyHidden";

interface Props {
  onCloseForm: () => void;
  contactId?: number;
}

interface FormData {
  firstName: string;
  lastName: string;
  phones: { number: string }[];
}

export default function ContactForm({ onCloseForm, contactId }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const { data: dataContactDetail } = useContactDetail(contactId);
  const contactDetail = dataContactDetail?.contact_by_pk;

  const initialFormData: FormData = {
    firstName: contactDetail?.first_name || "",
    lastName: contactDetail?.last_name || "",
    phones:
      contactDetail?.phones && contactDetail.phones.length
        ? contactDetail.phones
        : [{ number: "" }],
  };

  const [formData, setFormData] = useState(initialFormData);

  const [errors, setErrors] = useState({
    firstNameInput: "",
    lastNameInput: "",
  });

  const [
    addContact,
    {
      data: dataAddContact,
      loading: loadingAddContact,
      error: errorAddContact,
    },
  ] = useMutation(ADD_CONTACT_WITH_PHONES, {
    onCompleted: () => {
      onCloseForm();
      successAlertWithMessage("Contact added");
    },
    refetchQueries: [GET_CONTACT_LIST],
  });

  const [
    updateContact,
    {
      data: dataUpdateContact,
      loading: loadingUpdateContact,
      error: errorUpdateContact,
    },
  ] = useMutation(EDIT_CONTACT, {
    onCompleted: () => {
      onCloseForm();
      successAlertWithMessage("Contact updated");
    },
    refetchQueries: [GET_CONTACT_LIST],
  });

  const [
    addNumberToContact,
    {
      data: dataUpdatePhone,
      loading: loadingUpdatePhone,
      error: errorUpdatePhone,
    },
  ] = useMutation(ADD_NUMBER_TO_CONTACT);

  const [
    deleteNumberFromContact,
    {
      data: dataDeletePhone,
      loading: loadingDeletePhone,
      error: errorDeletePhone,
    },
  ] = useMutation(DELETE_NUMBER_FROM_CONTACT);

  const [getContacts, { loading: loadingExistingContact }] = useLazyQuery(
    GET_CONTACT_LIST,
    { fetchPolicy: "no-cache" }
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    const errorMessage = /[^a-z0-9\s]/i.test(value)
      ? "Name must not contain special characters"
      : "";

    setErrors({
      ...errors,
      [`${name}Input`]: errorMessage,
    });

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handlePhoneChange(value: string, index: number) {
    const updatedPhones = [...formData.phones];
    updatedPhones[index] = { number: value };
    setFormData({
      ...formData,
      phones: updatedPhones,
    });
  }

  function handleAddPhone() {
    setFormData({
      ...formData,
      phones: [...formData.phones, { number: "" }],
    });
  }

  function handleDeletePhone(index: number) {
    setFormData({
      ...formData,
      phones: formData.phones.filter((_, idx) => idx !== index),
    });
  }

  async function updateContactAndPhone() {
    if (!contactDetail?.phones) {
      return;
    }

    const deletePromises = contactDetail.phones.map((phone) => {
      return deleteNumberFromContact({
        variables: {
          contact_id: contactId,
          number: phone.number,
        },
      });
    });

    await Promise.all([...deletePromises]);

    const addPromises = formData.phones.map((phone) => {
      return addNumberToContact({
        variables: {
          contact_id: contactId,
          phone_number: phone.number,
        },
      });
    });

    await Promise.all([...addPromises]);

    await updateContact({
      variables: {
        id: contactId,
        _set: {
          first_name: formData.firstName,
          last_name: formData.lastName,
        },
      },
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const { firstName, lastName, phones } = formData;
    if (
      !(firstName && lastName && phones[0]) ||
      errors.firstNameInput ||
      errors.lastNameInput
    ) {
      return errorAlertWithMessage("Required fields cannot be empty");
    }

    /*
      I store it inside a variable, since using the `data` variable
      from `useLazyQuery` returns undefined at first
    */
    const existingContact = await getContacts({
      variables: {
        where: {
          id: {
            _neq: contactId,
          },
          first_name: {
            _eq: firstName,
          },
          last_name: {
            _eq: lastName,
          },
        },
      },
    });

    if (existingContact.data.contact.length) {
      return errorAlertWithMessage("Contact with that name already exists");
    }

    if (contactId) {
      await updateContactAndPhone();
    } else {
      await addContact({
        variables: {
          first_name: firstName,
          last_name: lastName,
          phones: phones,
        },
      });
    }

    setIsLoading(false);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Spacer size={56} />
      <div>
        <Title>{contactId ? "Edit" : "Add"} Contact</Title>
        <GridWrapper>
          <InputWrapper>
            <RequiredLabel htmlFor="firstName">First Name</RequiredLabel>
            <Input
              data-testid="first-name"
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            {errors.firstNameInput && (
              <ErrorMessage>{errors.firstNameInput}</ErrorMessage>
            )}
          </InputWrapper>

          <InputWrapper>
            <RequiredLabel htmlFor="lastName">Last Name</RequiredLabel>
            <Input
              data-testid="last-name"
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            {errors.lastNameInput && (
              <ErrorMessage>{errors.lastNameInput}</ErrorMessage>
            )}
          </InputWrapper>

          {formData.phones.map((phone, idx) => (
            <InputWrapper key={idx}>
              {idx === 0 ? (
                <RequiredLabel htmlFor={`phone-${idx}`}>
                  Phone {idx + 1}
                </RequiredLabel>
              ) : (
                <Label htmlFor={`phone-${idx}`}>Phone {idx + 1}</Label>
              )}
              <Input
                data-testid={`phone-${idx}`}
                type="tel"
                id={`phone-${idx}`}
                value={phone.number}
                onChange={(e) => handlePhoneChange(e.target.value, idx)}
                required={idx === 0}
              />
              {idx > 0 && (
                <DeletePhoneButton
                  type="button"
                  onClick={() => handleDeletePhone(idx)}
                >
                  <Icon id="minus" size={12} />
                  <VisuallyHidden>delete phone</VisuallyHidden>
                </DeletePhoneButton>
              )}
            </InputWrapper>
          ))}
          <PhoneButtonGroup>
            <AddPhoneButton
              type="button"
              onClick={handleAddPhone}
              data-testid="add-phone-button"
            >
              <Icon id="plus" size={12} />
            </AddPhoneButton>
            <span>add phone</span>
          </PhoneButtonGroup>
        </GridWrapper>
      </div>

      <Spacer size={24} />
      <ButtonWrapper>
        <ButtonGroup>
          <CancelButton type="button" onClick={onCloseForm}>
            Cancel
          </CancelButton>
          {isLoading ? (
            <LoadingButton />
          ) : (
            <SaveButton
              disabled={
                errors.firstNameInput || errors.lastNameInput ? true : false
              }
              type="submit"
            >
              Save
            </SaveButton>
          )}
        </ButtonGroup>
      </ButtonWrapper>
      <Spacer size={12} />
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: ${WEIGHTS.bold};
`;

const GridWrapper = styled.div`
  display: grid;
  margin-top: 1.5rem;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  column-gap: 1rem;
  row-gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: #374151;
`;

const RequiredLabel = styled(Label)`
  &::after {
    content: "*";
    color: ${COLORS.red[600]};
  }
`;

const InputWrapper = styled.div`
  grid-column: 1 / span 2;
  position: relative;
  max-width: 90%;
`;

const Input = styled.input`
  display: block;
  padding: 8px 16px;
  margin-top: 4px;
  border-radius: 6px;
  border: 1px solid ${COLORS.gray[300]};
  width: 100%;
`;

const ErrorMessage = styled.span`
  font-size: 0.875rem;
  color: ${COLORS.red[600]};
`;

const ButtonWrapper = styled.div`
  padding-top: 20px;
  border-top: 1px solid ${COLORS.gray[300]};
  margin-top: auto;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: end;
  gap: 8px;
`;

const PhoneButtonGroup = styled.div`
  grid-column: 1 / span 2;
  display: flex;
  gap: 8px;
  align-items: center;
`;

const PhoneButton = styled.button`
  font-size: 0.875rem;
  border-radius: 50%;
  border: none;
  color: #fff;
  padding: 4px;
  box-shadow: 0 1px 2px 0 red(0, 0, 0, 0.05);
  transition: all 200ms ease;
  cursor: pointer;
`;

const AddPhoneButton = styled(PhoneButton)`
  background-color: ${COLORS.green[600]};

  &:hover {
    background-color: ${COLORS.green[700]};
  }
`;

const DeletePhoneButton = styled(PhoneButton)`
  background-color: ${COLORS.red[600]};
  position: absolute;
  left: calc(100% + 5px);
  top: 50%;

  &:hover {
    background-color: ${COLORS.red[700]};
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid ${COLORS.gray[300]};
  font-size: 0.875rem;
  font-weight: ${WEIGHTS.medium};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 200ms ease;
  cursor: pointer;
`;

const CancelButton = styled(Button)`
  background-color: #fff;

  &:hover {
    background-color: #f9fafb;
  }
`;

const SaveButton = styled(Button)`
  background-color: ${COLORS.green[600]};
  color: #fff;

  &:hover {
    background-color: ${COLORS.green[700]};
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
