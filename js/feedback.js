(() => {

	/*------------------
	Переключатель табов
	--------------------*/

	const driveTabs = (options = {}, cb) => {
		const containers = options.container || '.tab';
		const controls = options.controls || `.${containers}__button`;
		const selects = [options.selects].flat() || [`.${containers}__block`];
		const cls = options.cls || 'active';
	
		document.querySelectorAll(containers).forEach((container) => {
			const buttons = container.querySelectorAll(controls);
			const blocks = selects.map(set => container.querySelectorAll(set));
	
			buttons.forEach((button, i) => {
				button.addEventListener('click', (e) => {
					e.preventDefault();
	
					if (! e.target.classList.contains(`${cls}`)) {
						buttons.forEach((button, i) => {
							button.classList.remove(`${cls}`);
							blocks.map(set => set[i].classList.remove(`${cls}`));
						});
			
						button.classList.add(`${cls}`);
	
						blocks.map(set => {
							set[i].classList.add(`${cls}`);
							(typeof cb === 'function') && cb.call(set[i]);
						});
					}
				});
			});
		});
	}

	driveTabs({
		container: '.feedback',
		controls: '.feedback__cap',
		selects: '.feedback__block',
		cls: 'active'
	}, function() {
		this.classList.add('showing');
	
		this.addEventListener('animationend', e => {
			this.classList.remove('showing');
		}, { once: true });
	});
	

	/*------------------
	Модальное окно
	--------------------*/

	const dialogs = document.querySelectorAll('dialog');
	const scrollLockToggle = () => document.body.classList.toggle('scroll-lock', [...dialogs].some(dialog => dialog.open));

	dialogs.forEach(dialog => {
		dialog.addEventListener('click', ({currentTarget, target}) => {
			if (currentTarget === target || target.classList.contains('dialog__close')) {
				dialog.close();
				scrollLockToggle();
			}
		});
	});
	
	document.querySelectorAll('[data-modal]').forEach(link => {
		link.addEventListener('click', e => {
			e.preventDefault();
	
			[...dialogs].find(dialog => dialog.id == e.target.dataset.modal)?.showModal();
			scrollLockToggle();
		})
	});


	/*------------------
	Отправка данных из контактной формы
	--------------------*/

	const TELEGRAM_BOT_TOKEN = '7165788531:AAHiYNOAbiDNt9BrlEUM4AEgM62EnrqbePM';
	const TELEGRAM_CHAT_ID = '@CyberTeamContact';
	const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
	const rules = {
		common: {
			rule: new RegExp('^\\+?[-@/:\\.\\w]{5,100}$'),
			error: '<span>An error has occurred. Please try again later.</span>',
			empty: '<span>Please fill out all required fields.</span>',
			success: '<span>Thank you, your message has been sent.</span>'
		},
		tgm: {
			title: 'Telegram',
			error: '<span>Please enter a correct Telegram address.</span>',
			once: true
		},
		whp: {
			title: 'WhatsApp',
			error: '<span>Please enter the correct WhatsApp address.</span>',
			once: true
		},
		vkt: {
			title: 'VKontakte',
			error: '<span>Please enter the correct VKontakte address.</span>',
			once: true
		},
		blank: {
			title: 'Region',
			rule: new RegExp('^$', 'gs'),
			error: '<span>Spambot go away.</span>'
		},
		name: {
			title: 'Имя',
			rule: new RegExp('^[A-Za-zА-Яа-яё ]{2,30}$', 'iu'),
			error: '<span>Please enter a correct name.</span>',
			required: true
		},
		email: {
			title: 'Email',
			rule: new RegExp('^\\b[-\\w.]+@[\\w\\.]+\\.\\w{2,4}\\b$'),
			error: '<span>Please enter a correct email address.</span>'
		},
		phone: {
			title: 'Телефон',
			rule: new RegExp('^\\+?[-\\d()\\s]{6,30}$'),
			error: '<span>Please enter a correct phone number.</span>'
		},
		msg: {
			title: 'Сообщение',
			rule: new RegExp('^.{1,3000}$', 'u'),
			error: '<span>Please enter the correct message text.</span>'
		},
	}

	document.querySelector('.feedback').addEventListener('submit', async function(e) {
		e.preventDefault();

		let text = '';
		let once = false;

		const errors = [];
		const alerts = this.querySelector('.feedback__alerts');
		const button = this.querySelector('button.feedback__submit')
		const formData = Object.fromEntries(new FormData(this).entries());
		const setEmptyError = () => errors.includes(rules.common.empty) || errors.push(rules.common.empty);

		for (const key in formData) {
			if(!rules.hasOwnProperty(key)) continue;
			const rule = rules[key].rule || rules.common.rule;
			
			if (formData[key]) {
				once ||= !!rules[key].once;

				if (rule.test(formData[key])) {
					text += `${rules[key].title}: ${formData[key]}\n`;
				} else {
					errors.push(rules[key].error);
				}
			}

			if (!formData[key] && rules[key].required) setEmptyError();
		}

		if (!once) setEmptyError();
		
		if (!errors.length) {
			alerts.innerHTML = '';
			button.classList.add('pending');

			try {
				const response = await fetch(TELEGRAM_API, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						chat_id: TELEGRAM_CHAT_ID,
						text
					})
				});

				if (response.ok) {
					alerts.innerHTML = rules.common.success;
					this.reset();
				} else {
					throw new Error(response.statusText);
				}
			} catch (error) {
				console.error(error);
				errors.push(rules.common.error);
				alerts.innerHTML = errors.join('');
			} finally {
				button.classList.remove('pending');
			}

		} else {
			alerts.innerHTML = errors.join('');
		}

		alerts.classList.toggle('error', errors.length);
	});
	
})();