import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { InputGroup, Button } from 'react-bootstrap';
import {
  ErrorMessage, Field, Form, Formik,
} from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useUsername, useSocketInstance } from '../../context';
import ackWithTimeout from '../../utils';
import SendIcon from '../../images/send.svg';

const MessageForm = () => {
  const { t } = useTranslation();
  const socket = useSocketInstance();
  const { username } = useUsername();
  const currentChannelId = useSelector((state) => state.channelsInfo.currentChannelId);
  const inputRef = useRef(null);

  const validationSchema = Yup.object().shape({
    message: Yup.string()
      .trim()
      .required(),
  });

  const initialValues = {
    message: '',
  };

  const onSuccessSend = (resetForm, setSubmitting, setTouched, setFieldError) => ({ status }) => {
    if (status === 'ok') {
      resetForm();
      setTouched({ message: false });
    } else {
      setFieldError('message', t('errors.networkError'));
    }
    setSubmitting(false);
    inputRef.current.focus();
  };

  const onFailSend = (setSubmitting, setFieldError) => () => {
    inputRef.current.focus();
    setSubmitting(false);
    setFieldError('message', t('errors.networkError'));
    inputRef.current.focus();
  };

  const submitHandler = ({ message }, {
    resetForm, setSubmitting, setTouched, setFieldError,
  }) => {
    const newMsg = { body: message, channelId: currentChannelId, username };
    socket.volatile.emit(
      'newMessage',
      newMsg,
      ackWithTimeout(
        onSuccessSend(resetForm, setSubmitting, setTouched, setFieldError),
        onFailSend(setSubmitting, setFieldError),
        3000,
      ),
    );
  };

  const blurHandler = (setTouched) => () => {
    setTouched({ message: false });
  };

  useEffect(() => {
    inputRef.current.focus();
  }, [currentChannelId]);

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={submitHandler}
    >
      {({
        errors, touched, submitForm, isSubmitting, setTouched,
      }) => (
        <div className="py-3 px-5">
          <Form className="py-1 border rounded-2">
            <fieldset disabled={isSubmitting}>
              <InputGroup>
                <Field
                  name="message"
                  className={`border-0 p-0 ps-2 form-control ${errors.message && touched.message && 'is-invalid'}`}
                  innerRef={inputRef}
                  autoComplete="off"
                  placeholder={t('ui.messages.placeholder')}
                  onBlur={blurHandler(setTouched)}
                  data-testid="new-message"
                />
                <ErrorMessage className="invalid-tooltip top-0 translate-middle-y" name="message" component="div" />
                <Button onClick={submitForm} variant="" type="submit" title={t('ui.common.send')}>
                  <SendIcon />
                </Button>
              </InputGroup>
            </fieldset>
          </Form>
        </div>
      )}
    </Formik>

  );
};

export default MessageForm;
