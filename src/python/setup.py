from setuptools import setup
from version import VERSION


setup(
    name='version-stamper',
    version=VERSION,
    description="Manage/sync version numbers across all files that contain it, including git tags.",
    long_description=open('../../README.md').read(),
    long_description_content_type='text/markdown',
    license='MIT',
    classifiers=[
        'Development Status :: 1 - Planning',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3',
        'Operating System :: OS Independent',
        'Intended Audience :: Developers',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Utilities'
    ],
    url='https://github.com/pointw-dev/version-stamper',
    author='Michael Ottoson',
    author_email='michael@pointw.com',
#    package_dir={'': 'version_stamper'},
    packages=['version_stamper'],
    entry_points='''
        [console_scripts]
        stamp=version_stamper:main
    ''',
    zip_safe=False
)
