"use client";

import { useState } from "react";
import {
  UseSuspenseQueryResult,
  skipToken,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import styled from "@emotion/styled";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { COLORS, WEIGHTS } from "@/app/constants";
import {
  ADD_CONTACT_WITH_PHONES,
  ADD_NUMBER_TO_CONTACT,
  DELETE_NUMBER_FROM_CONTACT,
  EDIT_CONTACT,
  EDIT_PHONE_NUMBER,
  GET_CONTACT_DETAIL,
  GET_CONTACT_LIST,
} from "@/app/graphql/queries";
import {
  errorAlert,
  errorAlertWithMessage,
  successAlertWithMessage,
} from "@/app/helpers/alerts";

import Icon from "../Icon";
import Spacer from "../Spacer";
import LoadingButton from "../LoadingButton";
import { Contact } from "@/app/contactColumnDefs";

interface Props {
  onCloseForm: () => void;
  contactId?: number;
}

interface FormData {
  firstName: string;
  lastName: string;
  phones: { number: string }[];
}

interface ContactDetail {
  contact_by_pk: Contact;
}

export default function ContactForm({ onCloseForm, contactId }: Props) {
  const {
    data: dataContactDetail,
  }: UseSuspenseQueryResult<ContactDetail | undefined, any> = useSuspenseQuery(
    GET_CONTACT_DETAIL,
    contactId
      ? { variables: { id: contactId }, fetchPolicy: "no-cache" }
      : skipToken
  );

  const contactDetail = dataContactDetail?.contact_by_pk;

  const initialFormData: FormData = {
    firstName: contactDetail?.first_name || "",
    lastName: contactDetail?.last_name || "",
    phones: contactDetail?.phones || [{ number: "" }],
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

  function hasSpecialChars(str: string) {
    return /[^a-z0-9\s]/i.test(str);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    const errorMessage = hasSpecialChars(value)
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

  function handleDeletePhone() {
    setFormData({
      ...formData,
      phones: formData.phones.slice(0, formData.phones.length - 1),
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

    const addPromises = formData.phones.map((phone) => {
      return addNumberToContact({
        variables: {
          contact_id: contactId,
          phone_number: phone.number,
        },
      });
    });

    await Promise.all([...deletePromises, ...addPromises]);

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
            _like: firstName,
          },
          last_name: {
            _like: lastName,
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
  }

  const isLoading =
    loadingAddContact ||
    loadingExistingContact ||
    loadingUpdateContact ||
    loadingUpdatePhone ||
    loadingDeletePhone;

  return (
    <Form onSubmit={handleSubmit}>
      <div>
        <Title>{contactId ? "Edit" : "Add"} Contact</Title>
        <GridWrapper>
          <InputWrapper>
            <RequiredLabel htmlFor="firstName">First Name</RequiredLabel>
            <Input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            {errors.firstNameInput && (
              <ErrorMessage className="text-red-500 text-sm">
                {errors.firstNameInput}
              </ErrorMessage>
            )}
          </InputWrapper>

          <InputWrapper>
            <RequiredLabel htmlFor="lastName">Last Name</RequiredLabel>
            <Input
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            {errors.lastNameInput && (
              <ErrorMessage className="text-red-500 text-sm">
                {errors.lastNameInput}
              </ErrorMessage>
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
                type="text"
                id={`phone-${idx}`}
                value={phone.number}
                onChange={(e) => handlePhoneChange(e.target.value, idx)}
                required={idx === 0}
              />
            </InputWrapper>
          ))}
          <PhoneButtonWrapper>
            <PhoneButtonGroup>
              <AddPhoneButton type="button" onClick={handleAddPhone}>
                <Icon id="plus" size={12} />
              </AddPhoneButton>
              <span>add phone</span>
            </PhoneButtonGroup>
            {formData.phones.length > 1 && (
              <PhoneButtonGroup>
                <DeletePhoneButton type="button" onClick={handleDeletePhone}>
                  <Icon id="minus" size={12} />
                </DeletePhoneButton>
                <span>delete last phone</span>
              </PhoneButtonGroup>
            )}
          </PhoneButtonWrapper>
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
    </Form>
  );
}

const Form = styled.form`
  min-height: 100%;
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
`;

const Input = styled.input`
  display: block;
  padding: 8px 16px;
  margin-top: 4px;
  flex: 1 1 0;
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

const PhoneButtonWrapper = styled.div`
  grid-column: 1 / span 2;
  display: flex;
  gap: 12px;
`;

const PhoneButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 0.875rem;
`;

const PhoneButton = styled.button`
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

  :hover {
    background-color: ${COLORS.green[700]};
  }
`;

const DeletePhoneButton = styled(PhoneButton)`
  background-color: ${COLORS.red[600]};

  :hover {
    background-color: ${COLORS.red[700]};
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid ${COLORS.gray[300]};
  font-size: 0.875rem;
  font-weight: ${WEIGHTS.medium};
  box-shadow: 0 1px 2px 0 red(0, 0, 0, 0.05);
  transition: all 200ms ease;
  cursor: pointer;
`;

const CancelButton = styled(Button)`
  background-color: #fff;

  :hover {
    background-color: #f9fafb;
  }
`;

const SaveButton = styled(Button)`
  background-color: ${COLORS.green[600]};
  color: #fff;

  :hover {
    background-color: ${COLORS.green[700]};
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
