const axios = require("axios");
const cheerio = require("cheerio");
const FormData = require("form-data");
const { chromium } = require('playwright');

async function getInstagramVideoAndComments(pp) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto('https://fastdl.app/id');
        await page.fill('#search-form-input', pp);
        await page.click('.search-form__button');
        await page.waitForTimeout(8000);

        const results = await page.evaluate(() => {
            const outputList = document.querySelector('.output-list');
            const items = Array.from(outputList.querySelectorAll('.output-list__item'));

            const images = [];
            const videos = [];

            items.forEach(item => {
                const imageElement = item.querySelector('.media-content__image');
                const imageUrl = imageElement ? imageElement.src : null;

                const downloadButton = item.querySelector('.button--filled.button__download');
                const videoUrl = downloadButton ? downloadButton.href : null;

                // Memeriksa dan mengelompokkan URL berdasarkan akhiran
                if (imageUrl) {
                    if (imageUrl.endsWith('.jpg') || imageUrl.endsWith('.png') || imageUrl.endsWith('webp')) {
                        images.push(imageUrl);
                    } else {
                        videos.push(imageUrl);
                    }
                }

                if (videoUrl && !videoUrl.endsWith('.jpg') && !videoUrl.endsWith('.png') || imageUrl.endsWith('webp')) {
                    videos.push(videoUrl);
                }
            });

            const captionElement = outputList.querySelector('.output-list__caption p');
            const caption = captionElement ? captionElement.innerText : '';
            const comments = Array.from(outputList.querySelectorAll('.output-list__comments li')).map(comment => {
                return {
                    username: comment.querySelector('.output-list__comments-username a').innerText,
                    text: comment.querySelector('p').innerText
                };
            });

            return {
                images,
                videos,
                caption,
                comments
            };
        });


        return results;

    } catch (error) {
        console.error('Error fetching Instagram video and comments:', error);
        return null;
    } finally {
        await browser.close();
    }
}

var __awaiter = (this && this.__awaiter) || function(thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P ? value : new P(function(resolve) {
			resolve(value);
		});
	}
	return new(P || (P = Promise))(function(resolve, reject) {
		function fulfilled(value) {
			try {
				step(generator.next(value));
			} catch (e) {
				reject(e);
			}
		}

		function rejected(value) {
			try {
				step(generator["throw"](value));
			} catch (e) {
				reject(e);
			}
		}

		function step(result) {
			result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
		}
		step((generator = generator.apply(thisArg, _arguments || [])).next());
	});
};
async function spotifydl(url) {
	return __awaiter(this, void 0, void 0, function*() {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function*() {
			try {
				const a = cheerio.load((yield axios.get("https://spotifymate.com/en", {
					headers: {
						cookie: "session_data=o8079end5j9oslm5a7bou84rqc;",
						"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
					},
				})).data);
				const b = {
					name: a("form#get_video").find('input[type="hidden"]').attr("name") || "",
					value: a("form#get_video").find('input[type="hidden"]').attr("value") || "",
				};
				const d = new FormData();
				d.append("url", url);
				d.append(b.name, b.value);
				let s = yield axios.post("https://spotifymate.com/action", d, {
					headers: Object.assign(Object.assign({
						origin: "https://spotifymate.com/en"
					}, d.getHeaders()), {
						cookie: "session_data=o8079end5j9oslm5a7bou84rqc;",
						"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
					}),
				});
				if (s.statusText !== "OK")
					return reject("Fail Fetching");
				const c = cheerio.load(s.data);
				const e = {
					title: c(".dlvideos").find('h3[itemprop="name"]').text().trim(),
					artis: c(".dlvideos")
						.find(".spotifymate-downloader-middle > p > span")
						.text()
						.trim(),
					image: c(".dlvideos").find("img").attr("src") || "",
					cover: c(".dlvideos")
						.find(".spotifymate-downloader-right")
						.find("#none")
						.eq(1)
						.find("a")
						.attr("href") ||
						c(".dlvideos")
						.find(".spotifymate-downloader-right")
						.find("#pop")
						.eq(1)
						.find("a")
						.attr("href") ||
						"",
					download: c(".dlvideos")
						.find(".spotifymate-downloader-right")
						.find("#none")
						.eq(0)
						.find("a")
						.attr("href") ||
						c(".dlvideos")
						.find(".spotifymate-downloader-right")
						.find("#pop")
						.eq(0)
						.find("a")
						.attr("href") ||
						"",
					link: url,
				};
				resolve(e);
			} catch (e) {
				reject(e);
			}
		}));
	});
}

const fsaver = {
  download: async (urls) => {
    const url = `https://fsaver.net/download/?url=${urls}`;
    const headers = {
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        "sec-ch-ua": '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"'
    };
    try {
        const response = await axios.get(url, { headers });
        const html = response.data;
        const data = fsaver.getData(html);
        return data;
    } catch (error) {
      return { success: false, message: error.message };
      console.error("Error:", error.response ? error.response.data : error.message);      
    }
  },
  getData: async (content) => {
    try {
      const baseUrl = 'https://fsaver.net';
      const $ = cheerio.load(content);
      const videoSrc = $('.video__item').attr('src');
      const videoPoster = $('.video__item').attr('poster');
      const name = $('.download__item__user_info div').first().text().trim()
      const profilePicture = baseUrl + $('.download__item__profile_pic img').attr('src')
      
      const result = {
         video: baseUrl + videoSrc,
         thumbnail: baseUrl + videoPoster,
         userInfo: {
           name,
           profilePicture,
         },
      };
      return result;
    } catch (error) {
      return { success: false, message: error.message };
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  }
}

async function Mp3(url) {
  let title, image;

  const getDownloadId = async () => {
    const response = await fetch(`https://ab.cococococ.com/ajax/download.php?copyright=0&format=mp3&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`);
    return response.json();
  };

  const checkProgress = async (id) => {
    const response = await fetch(`https://p.oceansaver.in/ajax/progress.php?id=${id}`);
    return response.json();
  };

  const pollProgress = async (id) => {
    try {
      const data = await checkProgress(id);
      if (data.progress === 1000) {
        return {
          title: title,
          image: image,
          download_url: data.download_url
        };
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await pollProgress(id);
      }
    } catch (error) {
      throw new Error('Gagal memeriksa kemajuan: ' + error.message);
    }
  };

  try {
    const data = await getDownloadId();
    if (data.success && data.id) {
      title = data.info.title;
      image = data.info.image;
      return await pollProgress(data.id);
    } else {
      throw new Error('Gagal mendapatkan ID unduhan');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function Mp4(url) {
  let title, image;

  const getDownloadId = async () => {
    const response = await fetch(`https://ab.cococococ.com/ajax/download.php?copyright=0&format=360&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`);
    return response.json();
  };

  const checkProgress = async (id) => {
    const response = await fetch(`https://p.oceansaver.in/ajax/progress.php?id=${id}`);
    return response.json();
  };

  const pollProgress = async (id) => {
    try {
      const data = await checkProgress(id);
      if (data.progress === 1000) {
        return {
          title: title,
          image: image,
          download_url: data.download_url
        };
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await pollProgress(id);
      }
    } catch (error) {
      throw new Error('Gagal memeriksa kemajuan: ' + error.message);
    }
  };

  try {
    const data = await getDownloadId();
    if (data.success && data.id) {
      title = data.info.title;
      image = data.info.image;
      return await pollProgress(data.id);
    } else {
      throw new Error('Gagal mendapatkan ID unduhan');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function tiktok(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const encodedParams = new URLSearchParams();
      encodedParams.set("url", query);
      encodedParams.set("hd", "1");

      const response = await axios({
        method: "POST",
        url: "https://tikwm.com/api/",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Cookie: "current_language=en",
          "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
        },
        data: encodedParams,
      });
      const videos = response.data;
      resolve(videos);
    } catch (error) {
      reject(error);
    }
  });
}

async function pinterestDL(pinterestUrl) {
  try {
    const response = await axios.get(`https://www.savepin.app/download.php?url=${encodeURIComponent(pinterestUrl)}&lang=en&type=redirect`);

    const $ = cheerio.load(response.data);

    const thumbUrl = $('figure.media-left img').attr('src');
    const title = $('div.media-content strong').text().trim() || 'No title available';

    const details = [];

    $('tbody tr').each((i, element) => {
      const quality = $(element).find('td').eq(0).text().trim();
      const format = $(element).find('td').eq(1).text().trim().toLowerCase();
      const url = 'https://www.savepin.app/' + $(element).find('a').attr('href');

      if (format === 'jpg' || format === 'png' || format === 'jpeg') {
        details.push({
          image: {
            url,
            quality
          }
        });
      } else if (format === 'mp4') {
        details.push({
          video: {
            url,
            quality
          }
        });
      }
    });

    if (!thumbUrl || details.length === 0) {
      throw new Error('Unable to retrieve all required data.');
    }

    return JSON.stringify({
      title,
      thumb: thumbUrl,
      details
    }, null, 2);
  } catch (error) {
    console.error('Error occurred:', error);
    return null;
  }
}

module.exports = {
	spotifydl,
	fsaver,
	Mp3,
	Mp4,
	tiktok,
	pinterestDL,
	getInstagramVideoAndComments
};
