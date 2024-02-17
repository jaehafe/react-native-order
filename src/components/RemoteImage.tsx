import { Image } from 'react-native';
import * as React from 'react';
import { supabase } from '@/lib/supabase';

type RemoteImageProps = {
  path?: string | null;
  fallback: string;
} & Omit<React.ComponentProps<typeof Image>, 'source'>;

export default function RemoteImage({ path, fallback, ...imageProps }: RemoteImageProps) {
  const [image, setImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!path) return;

    (async () => {
      setImage(null);
      const { data, error } = await supabase.storage.from('product-images').download(path);

      if (error) {
        console.log(error);
      }

      if (data) {
        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          setImage(fr.result as string);
        };
      }
    })();
  }, [path]);

  if (!image) {
  }

  return <Image source={{ uri: image || fallback }} {...imageProps} />;
}
