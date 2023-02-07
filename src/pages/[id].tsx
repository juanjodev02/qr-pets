import { Box, Button, Card, Flex, FormControl, FormErrorMessage, FormLabel, Heading, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Text, useDisclosure, useToast, VStack, } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { Container } from "../components/Container";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { Hero } from "../components/Hero";
import { Puppy } from "../components/Puppy";
import { Qr } from "../models/qr.model";
import { findQr } from "../services/qr.collection";
import { ArrowRightIcon } from '@chakra-ui/icons';
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { useState } from "react";
import { Kitty } from "../components/kitty";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from "react-query";
import { registerInformation, sendHelperInformation } from "../services/information.collection";
import { useRouter } from "next/router";
import Lottie from "lottie-react";
import SuccessFile from "../public/sucess.json";
import { QrState } from "../models/qrState.model";

const secondStep = ({
  register,
  errors
}) => {
  return (
    <VStack py={4} gap={5}>
      <FormControl>
        <FormLabel>Nombre de mascota</FormLabel>
        <Input variant="filled" focusBorderColor="pink.400" {...register('petName')} />
        <FormErrorMessage>{errors.petName?.message}</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>Tipo de mascota</FormLabel>
        <Input variant="filled" focusBorderColor="pink.400" {...register('petType')} />
        <FormErrorMessage>{errors.petType?.message}</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>Raza de mascota</FormLabel>
        <Input variant="filled" focusBorderColor="pink.400" {...register('petBreed')} />
        <FormErrorMessage>{errors.petBreed?.message}</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>Edad de mascota</FormLabel>
        <Input variant="filled" focusBorderColor="pink.400" {...register('petAge')} />
        <FormErrorMessage>{errors.petAge?.message}</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>Tamaño de mascota</FormLabel>
        <Input variant="filled" focusBorderColor="pink.400" {...register('petSize')} />
        <FormErrorMessage>{errors.petSize?.message}</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>Género de mascota</FormLabel>
        <Input variant="filled" focusBorderColor="pink.400" {...register('petGender')} />
        <FormErrorMessage>{errors.petGender?.message}</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>Color de mascota</FormLabel>
        <Input variant="filled" focusBorderColor="pink.400" {...register('petColor')} />
        <FormErrorMessage>{errors.petColor?.message}</FormErrorMessage>
      </FormControl>
    </VStack>
  )
}

const firstStep = ({
  register,
  errors
}) => {
  return (
    <VStack py={4} gap={5}>
      <FormControl>
        <FormLabel>Nombre</FormLabel>
        <Input variant="filled" focusBorderColor="pink.400" {...register('name')} />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input variant="filled" focusBorderColor="pink.400" type="email" {...register('email')} />
        <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>Teléfono</FormLabel>
        <Input variant="filled" focusBorderColor="pink.400" type="email" {...register('phone')} />
        <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>Dirección</FormLabel>
        <Input variant="filled" focusBorderColor="pink.400" {...register('address')} />
        <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>Ciudad</FormLabel>
        <Input variant="filled" focusBorderColor="pink.400" {...register('city')} />
        <FormErrorMessage>{errors.city?.message}</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>Provincia</FormLabel>
        <Input variant="filled" focusBorderColor="pink.400" {...register('state')} />
        <FormErrorMessage>{errors.state?.message}</FormErrorMessage>
      </FormControl>
    </VStack>
  )
};

const steps = [
  { label: 'Información personal', content: firstStep },
  { label: 'Información de mascota', content: secondStep },
];

export type FormFields = {
  name: string;
  email: string;
  address: string;
  city: string;
  phone: string;
  state: string;

  petName: string;
  petType: string;
  petBreed: string;
  petAge: string;
  petSize: string;
  petGender: string;
  petColor: string;
}

const schema = yup.object().shape({
  name: yup.string().required("Nombre es requerido"),
  email: yup.string().email().required("Email es requerido"),
  address: yup.string().required("Dirección es requerido"),
  city: yup.string().required("Ciudad es requerido"),
  state: yup.string().required("Provincia es requerido"),

  petName: yup.string().required("Nombre de mascota es requerido"),
  petType: yup.string().required("Tipo de mascota es requerido"),
  petBreed: yup.string().required("Raza de mascota es requerido"),
  petAge: yup.string().required("Edad de mascota es requerido"),
  petSize: yup.string().required("Tamaño de mascota es requerido"),
  petGender: yup.string().required("Género de mascota es requerido"),
  petColor: yup.string().required("Color de mascota es requerido"),
});

const Slug = ({ qr }: { qr: Qr }) => {
  const router = useRouter();
  const [screen, setScreen] = useState(0);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [location, setLocation] = useState({
    latitude: '',
    longitude: '',
  });
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm <FormFields>({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

  const toast = useToast()

  const {
    mutate: registerInformationMutation,
    isLoading: isRegistering,
  } = useMutation(registerInformation, {
    onSuccess: () => {
      toast({
        title: "Información registrada",
        description: "La información se ha registrado correctamente",
        status: "success",
      })
      setIsFormSubmitted(true);
    },
  })

  const {
    mutate: sendHelperInformationMutation,
    isLoading: isSendingHelperInformation,
  } = useMutation(sendHelperInformation, {
    onSuccess: () => {
      onClose();
      toast({
        title: "Información enviada",
        description: "La información se ha enviado correctamente",
        status: "success",
      })
    }
  })

  const onClick = (isFinished: boolean) => {
    const id = router.query.id as string;
    if (isFinished) {
      registerInformationMutation(
        {
          id,
          data: getValues(),
        })
      return
    }
    nextStep();
  }

  const getLocation: () => Promise<[string, string]> = async () => {
    if (navigator.geolocation) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
          resolve([position.coords.latitude.toString(), position.coords.longitude.toString()])
        }, (error) => {
          reject(error)
        })
      })
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  const onOpenModal = async () => {
    const [lat, lng] = await getLocation();
    setLocation({
      latitude: lat,
      longitude: lng,
    })
    onOpen();
  }

  const onSendInformation = () => {
    sendHelperInformationMutation({
      id: router.query.id as string,
      helperEmail: contactEmail,
      helperName: contactName,
      helperPhone: contactPhone,
      latitude: location.latitude,
      longitude: location.longitude,
    })
  }

  if (qr.state === QrState.IN_USE) {
    return (
      <Container minH="100vh">
        <DarkModeSwitch />
        <Hero title="¡Bienvenido!" />
        <VStack w={"100%"} justifyContent="flex-start" alignItems="center" mb={20}>
          <Heading size="lg" textAlign="center" my={4}>
            Información de mascota
          </Heading>
          <Card w="100%"  flexDir="column" alignItems="flex-start" justifyContent="flex-start" padding={10} my={4}>
            <HStack>
              <Text textAlign="left" pb="1em" fontSize='2xl' fontWeight="black">
                Nombre de mascota:
              </Text>
              <Text textAlign="left" pb="1em" fontSize='2xl'>
                {qr.data.petName}
              </Text>
            </HStack>
            <HStack>
              <Text textAlign="left" pb="1em" fontSize='2xl' fontWeight="black">
                Tipo de mascota:
              </Text>
              <Text textAlign="left" pb="1em" fontSize='2xl'>
                {qr.data.petType}
              </Text>
            </HStack>
            <HStack>
              <Text textAlign="left" pb="1em" fontSize='2xl' fontWeight="black">
                Raza de mascota:
              </Text>
              <Text textAlign="left" pb="1em" fontSize='2xl'>
                {qr.data.petBreed}
              </Text>
            </HStack>
            <HStack>
              <Text textAlign="left" pb="1em" fontSize='2xl' fontWeight="black">
                Edad de mascota:
              </Text>
              <Text textAlign="left" pb="1em" fontSize='2xl'>
                {qr.data.petAge}
              </Text>
            </HStack>
            <HStack>
              <Text textAlign="left" pb="1em" fontSize='2xl' fontWeight="black">
                Tamaño de mascota:
              </Text>
              <Text textAlign="left" pb="1em" fontSize='2xl'>
                {qr.data.petSize}
              </Text>
            </HStack>
            <HStack>
              <Text textAlign="left" pb="1em" fontSize='2xl' fontWeight="black">
                Género de mascota:
              </Text>
              <Text textAlign="left" pb="1em" fontSize='2xl'>
                {qr.data.petGender}
              </Text>
            </HStack>
            <HStack>
              <Text textAlign="left" pb="1em" fontSize='2xl' fontWeight="black">
                Color de mascota:
              </Text>
              <Text textAlign="left" pb="1em" fontSize='2xl'>
                {qr.data.petColor}
              </Text>
            </HStack>
          </Card>
          <Spacer />
          <Spacer />
          <Spacer />
          <Heading size="lg" textAlign="center" my={4}>
            Información de propetario
          </Heading>
          <Card w="100%" padding={10} flexDir="column" alignItems="flex-start" justifyContent="flex-start" my={4}>
            <HStack>
              <Text textAlign="left" pb="1em" fontSize='2xl' fontWeight="black">
                Nombre:
              </Text>
              <Text textAlign="left" pb="1em" fontSize='2xl'>
                {qr.data.name}
              </Text>
            </HStack>
            <HStack>
              <Text textAlign="left" pb="1em" fontSize='2xl' fontWeight="black">
                Dirección:
              </Text>
              <Text textAlign="left" pb="1em" fontSize='2xl'>
                {qr.data.address}
              </Text>
            </HStack>
            <HStack>
              <Text textAlign="left" pb="1em" fontSize='2xl' fontWeight="black">
                Ciudad:
              </Text>
              <Text textAlign="left" pb="1em" fontSize='2xl'>
                {qr.data.city}
              </Text>
            </HStack>
            <HStack>
              <Text textAlign="left" pb="1em" fontSize='2xl' fontWeight="black">
                Estado:
              </Text>
              <Text textAlign="left" pb="1em" fontSize='2xl'>
                {qr.data.state}
              </Text>
            </HStack>
            <HStack>
              <Text textAlign="left" pb="1em" fontSize='2xl' fontWeight="black">
                Email:
              </Text>
              <Text textAlign="left" pb="1em" fontSize='2xl'>
                {qr.data.email}
              </Text>
            </HStack>
          </Card>
          <Spacer />
          <Spacer />
          <Button colorScheme="purple" onClick={onOpenModal}>Contactar al dueño</Button>
        </VStack>
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Contacta al dueño</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text textAlign="center" pb="1em" fontSize='1xl' fontWeight="black">
              Para contactar al dueño, indica tu nombre e información de contacto.
            </Text>
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input placeholder="Nombre" onChange={(e) => setContactName(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input placeholder="Email" onChange={(e) => setContactEmail(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Teléfono</FormLabel>
              <Input type="number" placeholder="Teléfono" onChange={(e) => setContactPhone(e.target.value)} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button isLoading={isSendingHelperInformation} colorScheme='blue' mr={3} onClick={onSendInformation} disabled={isSendingHelperInformation}>
              Enviar información
            </Button>
            <Button variant='ghost' onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </Container>
    )
  }

  if (isFormSubmitted) {
    return (
      <Container minH="100vh">
      <DarkModeSwitch />
      <Hero title="¡Bienvenido!" />
      <Lottie
        animationData={SuccessFile}
        loop={true}
        style={{ height: 300 }}
      />
      <Text textAlign="center" pb="1em" fontSize='2xl' fontWeight="black">
        Listo, tu información ha sido registrada correctamente y tu mascota ya está protegida
      </Text>
    </Container>
    )
  }

  return (
    <Container minH="100vh">
      <DarkModeSwitch />
      <Hero title="¡Bienvenido!" />
      {
        screen === 0 ? (
          <>
            <Puppy />
            <Text textAlign="center" pb="1em" fontSize='2xl' fontWeight="black">Gracias por la compra de nuestro producto, te ayudaremos a completar tu información y la de tu mascota</Text>
            <Button rightIcon={<ArrowRightIcon />} maxWidth={400} colorScheme="purple" w="100%" onClick={() => setScreen(1)}>Siguiente</Button>
          </>
        ) : (
          <Flex mt='5em' flexDir="column" width="100%">
            <Heading textAlign="center">Completa la información para continuar</Heading>
            <Box position="relative" bottom={0} right={0}>
              <Kitty />
            </Box>
          <Steps colorScheme="purple" activeStep={activeStep}>
            {steps.map(({ label, content }) => (
              <Step label={label} key={label}>
                <form onSubmit={handleSubmit((e) => console.log(3))}>
                  {content({ register, errors })}
                </form>
              </Step>
            ))}
          </Steps>
          {activeStep === steps.length ? (
            <Flex p={4}>
              <Button mx="auto" size="sm" colorScheme="purple" onClick={reset}>
                Reset
              </Button>
            </Flex>
          ) : (
            <Flex my={10} width="100%" justify="flex-end">
              <Button
                colorScheme="purple"
                isDisabled={activeStep === 0}
                mr={4}
                onClick={prevStep}
                size="sm"
                variant="ghost"
              >
                Atrás
              </Button>
              <Button isDisabled={isRegistering} isLoading={isRegistering} colorScheme="purple" size="sm" onClick={() => onClick(activeStep === steps.length - 1)}>
                {activeStep === steps.length - 1 ? 'Terminar' : 'Siguiente'}
              </Button>
            </Flex>
          )}
        </Flex>
        )
      }
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params;

  if (!id) {
    return {
      notFound: true,
    }
  }


  try {
    const data = await findQr(id as string);
    return {
      props: {
        qr: data,
      }
    }
  } catch (e) {
    return {
      notFound: true,
    }
  }
}

export default Slug