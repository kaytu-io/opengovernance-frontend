import { Fragment, ReactNode } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Button, Flex, Icon, Title } from '@tremor/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface Iprops {
    open: boolean
    onClose: any
    title?: string
    children?: ReactNode
}

export default function DrawerPanel({
    open,
    onClose,
    children,
    title,
}: Iprops) {
    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-40" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-40 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-xl">
                                    <Flex
                                        flexDirection="col"
                                        justifyContent="start"
                                        className="h-full w-full bg-white dark:bg-gray-900 py-8 shadow-xl"
                                    >
                                        <Dialog.Title className="absolute top-0 z-10 w-[560px] bg-white dark:bg-gray-900 px-4 text-gray-900 border-b pt-5 pb-4">
                                            <Flex>
                                                <Title className="text-lg font-semibold my-1">
                                                    {title}
                                                </Title>
                                                <Button
                                                    variant="light"
                                                    className="rounded-md text-gray-300 hover:text-white focus:outline-none"
                                                    onClick={onClose}
                                                >
                                                    <span className="sr-only">
                                                        Close panel
                                                    </span>
                                                    <Icon
                                                        icon={XMarkIcon}
                                                        color="blue"
                                                        className="h-8 w-8"
                                                    />
                                                </Button>
                                            </Flex>
                                        </Dialog.Title>
                                        <div className="w-full h-full pt-16 px-6">
                                            {children}
                                        </div>
                                    </Flex>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
