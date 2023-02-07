import { Text, Button, useToast, VStack } from '@chakra-ui/react'
import QRCode from 'qrcode';
import {DarkModeSwitch} from "../../components/DarkModeSwitch";
import {Container} from "../../components/Container";
import { useMutation } from 'react-query';
import { addQr as addQrFunction } from '../../services/qr.collection';
import { QrState } from '../../models/qrState.model';
import { useState } from 'react';
import { idToUrl } from '../../utils/utils';
import { RepeatIcon, DownloadIcon } from '@chakra-ui/icons';


const Admin = () => {
  const [qrData, setQrData] = useState<string>('');
  const {
    mutate: addQr,
    data: addQrData,
    isLoading: isAddingQr,
    error: addQrError,
  } = useMutation(addQrFunction, {
    onSuccess: async ({ id }) => {
      toast({
        title: "QR added",
        description: "QR added successfully with id: " + id,
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      const qrData = await generateQr(idToUrl(id))
      setQrData(qrData);
    }
  });

  const toast = useToast()

  const generateQr = (data: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      QRCode.toDataURL(data, {
        width: 800,
        margin: 2,
        color: {
          dark: '#335383FF',
          light: '#EEEEEEFF'
        }
      }, (err, url) => {
        if (err) {
          return reject(err);
        }
        return resolve(url);
      });
    })
  }

  const onAddQr = () => addQr({
    state: QrState.FREE,
    data: null
  });

  const onDownloadQr = () => {
    const link = document.createElement('a');
    link.href = qrData;
    link.setAttribute('download', `${addQrData.id}.png`);
    document.body.appendChild(link);
    link.click();
    setQrData('');
  }

  return (
    <Container height="100vh">
      <DarkModeSwitch />
        <Text fontSize='6xl' fontWeight="black">Welcome Admin</Text>
        <Text py="1em" fontSize='2xl'>Generate QR</Text>
        {
          !qrData ? (
            <>
              <Button rightIcon={<RepeatIcon />} colorScheme='blue' variant='solid' isLoading={isAddingQr} onClick={onAddQr}>Generate</Button>
              {
                addQrError && <Text>{String(addQrError)}</Text>
              }
            </>
          ) : (<VStack my='2em'>
            <img id="qr" src={qrData} height={300} width={300} />
            <Text fontSize='lg' color='ActiveCaption'>{addQrData.id}</Text>
            <Button rightIcon={<DownloadIcon />} my='2em' colorScheme='blue' variant='solid' onClick={onDownloadQr}>Download</Button>
          </VStack>)
        }
    </Container>
  );
}

export default Admin