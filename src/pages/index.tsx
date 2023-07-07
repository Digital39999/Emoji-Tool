import { Image, Box, Divider, Text, SimpleGrid, Flex, useToast, HStack, VStack, CloseButton, Input, Button, ButtonGroup, useMediaQuery, Tooltip, Switch } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useCallback, useEffect, useState } from 'react';

export type Emojis = Record<string, Record<string, string>>;
export type EmojisOut = Record<string, Record<string, {
	id: string;
	url: string;
	emoji: string;
}>>;

export async function getEmojis() {
	const response: { data: Emojis } = await fetch('https://api.crni.xyz/emojis').then((res) => res.json()).catch(() => null);
	if (!response || !response.data) return null;

	const out: EmojisOut = {};

	for (const [category, emojis] of Object.entries(response.data)) {
		out[category] = {};

		for (const [name, dc] of Object.entries(emojis)) {
			out[category][`${category}.${name}`] = {
				id: `${category}.${name}`,
				url: `https://cdn.discordapp.com/emojis/${dc?.split(':')[2]?.replace('>', '')}.png`?.replace(' ', ''),
				emoji: dc,
			};
		}
	}

	return out;
}


export default function HomePage({ emojiData }: { emojiData: EmojisOut }) {
	const [currentEmojiShown, setCurrentEmojiShown] = useState<string | null>(null);
	const [isInputInvalid, setInvalidInput] = useState(false);
	const [copyActualId, setCopyActualId] = useState(false);
	const [time, setTime] = useState(new Date());

	const isMobile = useMediaQuery('(max-width: 768px)')[0];
	const Toast = useToast();
	console.log(emojiData);

	const handleCopyClick = (id: string, url: string, actual: string) => {
		setCurrentEmojiShown(url);

		navigator.clipboard.writeText(copyActualId ? actual : id);
		Toast({
			description: `Emoji ${copyActualId ? actual : id} copied to clipboard.`,
			status: 'success',
			duration: 2000,
			isClosable: true,
			position: 'bottom',
			render(props) {
				return (
					<Flex
						pos={'relative'}
						bg='#42484b'
						p={3}
						pr={12}
						rounded={'xl'}
						alignItems={'center'}
						justifyContent={'space-between'}
					>
						<HStack spacing={4} align={'start'}>
							<Image boxSize={5} src={url} alt={id} />
							<VStack align={'start'} spacing={0}>
								<Text fontSize='sm' fontWeight='500'>
									{props.description}
								</Text>
							</VStack>
						</HStack>
						<CloseButton
							pos={'absolute'}
							top={2}
							right={2}
							rounded={'lg'}
							transition={'all .2s ease'}
							p={2}
							_hover={{ bg: 'alpha' }}
							onClick={() => props.onClose()}
						/>
					</Flex>
				);
			},
		});
	};

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(new Date());
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const makeDiscordPreview = useCallback((url: string, theme: string, justEmoji?: boolean) => {
		return (
			<Flex
				bg={theme === 'dark' ? '#313338' : '#ffffff'}
				p={4}
				rounded='md'
				w='100%'
				overflow='hidden'
				transition='all 0.4s ease'
				_hover={{
					cursor: 'pointer',
					backgroundColor: theme === 'dark' ? '#2e3035' : '#f7f7f7',
				}}
			>
				<Image
					src='/discord.png'
					boxSize={10}
					borderRadius={'full'}
					mr={2}
					cursor='pointer'
				/>
				<Flex direction='column'>
					<Flex align='center'>
						<Text
							fontWeight={500}
							letterSpacing='0.5px'
							cursor='pointer'
							mt={-1}
							color={theme === 'dark' ? '#ffffff' : '#000000'}
							id='username'
						>
							Discord
						</Text>
					</Flex>
					{justEmoji ? <Box display='inline-block'>
						<Image
							boxSize={10}
							mb={-1}
							src={url}
							objectFit={'cover'}
							display='inline-block'
							alt='emoji'
							draggable={false}
						/>
						<Image
							boxSize={10}
							mb={-1}
							ml={1}
							src={url}
							objectFit={'cover'}
							display='inline-block'
							alt='emoji'
							draggable={false}
						/>
					</Box> : <Flex align='center'>
						<Text color={theme === 'dark' ? '#ffffff' : '#000000'} fontSize='sm'>
							Never gonna give you up.
							<Image
								boxSize={5}
								ml={1}
								mb={-1}
								src={url}
								objectFit={'cover'}
								display='inline-block'
								alt='emoji'
								draggable={false}
							/>
							<Image
								boxSize={5}
								ml={1}
								mb={-1}
								src={url}
								objectFit={'cover'}
								display='inline-block'
								alt='emoji'
								draggable={false}
							/>
						</Text>
					</Flex>}
				</Flex>
			</Flex>
		);
	}, []);

	return (
		<Flex minH="100vh" bg="#4b4f56" color="white" overflow="hidden" flexDir={{ base: 'column', md: 'row' }}>
			<VStack p={isMobile ? 3 : 0} align={'center'} spacing={5} h='100%'>
				<Box
					zIndex={10}
					w={{ base: '100%', md: '25%' }}
					minW="340px"
					borderRadius={isMobile ? '2xl' : 'none'}
					bg="#36393f"
					p={4}
					h={{ base: '50vh', md: '100vh' }}
					overflow="auto"
					css={{
						'&::-webkit-scrollbar': {
							display: 'none',
						},
					}}
				>
					<>
						<Flex alignItems='center' justifyContent='space-between'>
							<Tooltip
								label={'In my defence, this looks nice here? doesn\'t it?'}
								bg='#5961ec'
								color='white'
								p={1}
								px={3}
								rounded='md'
								hasArrow
								arrowSize={6}
								arrowShadowColor='rgba(0, 0, 0, 0.1)'
								my={1}
							>
								<Text fontSize={'md'} opacity={1}>{time.toLocaleString('en-US', {
									weekday: 'short',
									month: 'short',
									day: 'numeric',
									year: 'numeric',
									hour: 'numeric',
									minute: '2-digit',
									second: '2-digit',
									hour12: true,
								})}</Text>
							</Tooltip>
						</Flex>
						<Divider mt={1} mb={3} />
						<Flex alignItems='center' justifyContent='space-between'>
							<VStack w='100%' justifyContent='space-between' h='100%'>
								{makeDiscordPreview(currentEmojiShown || 'https://cdn.crni.xyz/r/status.png', 'light')}
								{makeDiscordPreview(currentEmojiShown || 'https://cdn.crni.xyz/r/status.png', 'light', true)}
								{makeDiscordPreview(currentEmojiShown || 'https://cdn.crni.xyz/r/status.png', 'dark')}
								{makeDiscordPreview(currentEmojiShown || 'https://cdn.crni.xyz/r/status.png', 'dark', true)}
							</VStack>
						</Flex>
						<Divider mt={3} mb={3} />
						<Flex alignItems='center' justifyContent='space-between'>
							<Input
								isInvalid={isInputInvalid}
								placeholder='Custom Emoji (Url, Id, Syntax)'
								onChange={(e) => {
									if (!e.target.value) return setInvalidInput(false);

									const discordUrlRegex = /(?:https?:\/\/)?(?:cdn\.)?discord(?:app)?\.com\/(?:emojis|assets)\/(\d+)\.(?:png|gif|webp)/i;
									const discordInAppRegex = /<(a)?:[a-zA-Z0-9_]+:(\d+)>/i;
									const emojiIdRegex = /^(\d+)$/i;

									const id = e.target.value.match(discordUrlRegex)?.[1] || e.target.value.match(discordInAppRegex)?.[2] || e.target.value.match(emojiIdRegex)?.[1];
									if (id) setCurrentEmojiShown(`https://cdn.discordapp.com/emojis/${id}.${e.target.value.match(discordUrlRegex)?.[2] || e.target.value.match(discordInAppRegex)?.[3] || 'gif'}`);
									else {
										setCurrentEmojiShown(currentEmojiShown || 'https://cdn.crni.xyz/r/status.png');
										setInvalidInput(true);
									}
								}}
							/>
						</Flex>
						<Divider mt={3} mb={3} />
						<Flex alignItems='center' justifyContent='space-between'>
							<Text fontSize='md' textStyle='bold' style={{ userSelect: 'none' }}>Actual Emoji Id</Text>
							<Switch
								size='lg'
								ml={2}
								isChecked={copyActualId}
								onChange={() => setCopyActualId(!copyActualId)}
							/>
						</Flex>	
						<Divider mt={3} mb={3} />
						<Flex alignItems='center' justifyContent='space-between' w='100%' overflow='hidden' flexWrap='wrap'>
							<ButtonGroup spacing={1.5} w='100%' overflow='hidden' mb={2}>
								<Button w='50%' rightIcon={<ExternalLinkIcon />} colorScheme='red' variant='outline' isTruncated onClick={() => window.open('https://discord.gg/4rphpersCa', '_blank')}>Help</Button>
								<Button w='50%' rightIcon={<ExternalLinkIcon />} colorScheme='green' variant='outline' isTruncated onClick={() => window.open('https://api.crni.xyz/emojis', '_blank')}>API</Button>
							</ButtonGroup>
							<ButtonGroup spacing={1.5} w='100%' overflow='hidden' flexWrap='wrap'>
								<Button w='100%' rightIcon={<ExternalLinkIcon />} colorScheme='blue' variant='outline' isTruncated onClick={() => window.open('https://statusbot.us', '_blank')}>Status Bot</Button>
							</ButtonGroup>
						</Flex>
					</>
				</Box>
			</VStack>
			<Flex
				w="auto"
				p={4}
				flexDir="column"
				overflow="auto"
				h={{ base: '45vh', md: '100vh' }}
				css={{
					'&::-webkit-scrollbar': {
						display: 'none',
					},
				}}
			>
				{Object.entries(emojiData || {}).map(([category, emojis]) => {
					return !Object.keys(emojis || {}).length ? (
						<></>
					) : (
						<Box key={category} textAlign='center' fontWeight='bold' p={2}>
							<Box display='flex' alignItems='center' justifyContent='center' position='relative' >
								<Divider />
								<Box alignItems={'center'} justifyContent={'center'} display={'flex'} ml={2} mr={2}>
									<Text fontSize='2xl'>
										{category.charAt(0).toUpperCase() + category.slice(1)}
									</Text>
								</Box>
								<Divider />
							</Box>
							<SimpleGrid
								maxWidth={Object.keys(emojis || {}).length * 120}
								minChildWidth={'100px'}
								key={category}
								gap={2}
								mx={2}
								mt={2}
								mb={-2}
							>
								{Object.entries(emojis || {}).map(([id, data], index) => {
									return (
										<Flex
											key={id}
											rounded={'xl'}
											p={1}
											cursor={'pointer'}
											_hover={{
												bg: 'rgba(255, 255, 255, 0.1)',
												transition: 'all .2s ease',
											}}
											sx={{ aspectRatio: '1/1' }}
											transition={'all .2s ease'}
											onClick={() => handleCopyClick(id, data.url, data.emoji)}
											h='80px'
										>
											<Image
												src={data.url}
												alt={id}
												w='100%'
												h='100%'
												boxSize={'auto'}
												draggable='false'
												userSelect={'none'}
												loading={index >= 100 ? 'lazy' : 'eager'}
											/>
										</Flex>
									);
								})}
							</SimpleGrid>
						</Box>
					);
				})}
			</Flex>
		</Flex>
	);
}

HomePage.getInitialProps = async () => {
	const emojiData = await getEmojis();
	return { emojiData };
};
